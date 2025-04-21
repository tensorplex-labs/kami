const fs = require('fs');
const path = require('path');
const widdershins = require('widdershins');
const { execSync } = require('child_process');

async function generateDocs() {
  try {
    console.log('Starting documentation generation process...');
    
    // Path to the Swagger JSON file
    const swaggerFilePath = path.join(__dirname, '..', 'swagger-spec.json');
    const docsDir = path.join(__dirname, '..', 'docs');
    const slateDir = path.join(docsDir, 'slate');
    const slateSourceDir = path.join(slateDir, 'source');
    
    
    // Step 1: Read and parse the Swagger JSON file
    console.log('Reading Swagger JSON...');
    const swaggerJsonContent = fs.readFileSync(swaggerFilePath, 'utf8');
    let swaggerSpec;
    
    try {
      swaggerSpec = JSON.parse(swaggerJsonContent);
    } catch (e) {
      throw new Error(`Failed to parse Swagger JSON: ${e.message}`);
    }
    
    // Step 2: Create docs directory and clone Slate if needed
    console.log('Setting up Slate repository...');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    if (!fs.existsSync(slateDir)) {
      console.log('Cloning Slate repository...');
      try {
        execSync('git clone https://github.com/slatedocs/slate.git slate', { 
          cwd: docsDir,
          stdio: 'inherit'
        });
      } catch (error) {
        throw new Error(`Failed to clone Slate repository: ${error.message}`);
      }
    }
    
    // Step 3: Configure widdershins options
    console.log('Configuring Widdershins options...');
    const options = {
      codeSamples: true,
      httpsnippet: true,
      language_tabs: [
        { bash: 'Shell' }, 
        { javascript: 'JavaScript' },
        { typescript: 'TypeScript' }
      ],
      includeLevel: 2,
      omitHeader: true,
      theme: 'slate'
    };
    
    // Step 4: Convert to Slate-compatible markdown
    console.log('Converting to Slate Markdown...');
    const markdownOutput = await widdershins.convert(swaggerSpec, options);
    
    // Ensure the slate/source directory exists
    if (!fs.existsSync(slateSourceDir)) {
      fs.mkdirSync(slateSourceDir, { recursive: true });
    }
    
    // Write the output to the source directory
    fs.writeFileSync(path.join(slateSourceDir, 'index.html.md'), markdownOutput, 'utf8');
    console.log('Markdown for Slate generated successfully!');
    
    // Step 5: Install dependencies and build Slate
    console.log('Installing Slate dependencies and building documentation...');
    try {
      // Determine if we need to detect local Ruby or use GitHub Actions setup
      const isCI = process.env.CI === 'true';
      
      if (!isCI) {
        console.log('Checking Ruby installation...');
        try {
          execSync('ruby --version', { stdio: 'inherit' });
          execSync('bundle --version', { stdio: 'inherit' });
        } catch (error) {
          console.error('Ruby or Bundler not found! Please install Ruby and Bundler to build Slate documentation.');
          console.error('For macOS: brew install ruby && gem install bundler');
          console.error('For Ubuntu: sudo apt-get install ruby-full && sudo gem install bundler');
          throw new Error('Ruby environment not available');
        }
      }
      
      // Install dependencies and build
      execSync('bundle install', { 
        cwd: slateDir,
        stdio: 'inherit'
      });
      
      execSync('bundle exec middleman build --clean', {
        cwd: slateDir,
        stdio: 'inherit'
      });
      
      console.log('Documentation built successfully!');
      console.log(`Output directory: ${path.join(slateDir, 'build')}`);
      
      // For local development, offer to start the server
      if (!isCI) {
        console.log('\nTo serve the documentation locally, run:');
        console.log(`cd ${path.relative(process.cwd(), slateDir)} && bundle exec middleman server`);
      }
      
    } catch (error) {
      throw new Error(`Failed to build Slate documentation: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`Error generating documentation: ${error.message}`);
    process.exit(1);
  }
}

generateDocs();