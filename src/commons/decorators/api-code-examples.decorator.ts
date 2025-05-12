// api-code-examples.decorator.ts
import * as fs from 'fs';
import * as path from 'path';

import { DECORATORS } from '@nestjs/swagger/dist/constants';

interface CodeSampleFile {
  filePath: string;
  lang: string;
  label?: string;
}

export function ApiCodeSamples(samples: CodeSampleFile[]) {
  return (target: any, key?: string, descriptor?: any) => {
    if (descriptor) {
      const extensions = Reflect.getMetadata(DECORATORS.API_EXTENSION, descriptor.value) || {};

      // Read code samples from files
      const codeSamples = samples
        .map(sample => {
          try {
            const filePath = path.resolve(process.cwd(), sample.filePath);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
              console.warn(`Code sample file not found: ${filePath}`);
              return null;
            }

            const source = fs.readFileSync(filePath, 'utf8');

            // Ensure language is lowercase for Widdershins compatibility
            // but keep the original label for display
            return {
              // Language identifier must be lowercase for compatibility
              lang: sample.lang,
              // Label can remain capitalized for display
              label: sample.label || sample.lang,
              source: source,
            };
          } catch (error) {
            console.warn(`Error reading code sample file: ${sample.filePath}`, error);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries (failed file reads)

      if (codeSamples.length > 0) {
        extensions['x-code-samples'] = codeSamples;
        Reflect.defineMetadata(DECORATORS.API_EXTENSION, extensions, descriptor.value);
      }
    }
    return descriptor;
  };
}

// Helper function for Python samples
export function pythonSample(filePath: string) {
  return {
    filePath,
    lang: 'Python',
    label: 'Python',
  };
}

// Helper function for TypeScript samples
export function typescriptSample(filePath: string) {
  return {
    filePath,
    lang: 'TypeScript',
    label: 'TypeScript',
  };
}
