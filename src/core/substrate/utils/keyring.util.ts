import { KeyringPairInfo } from '@app/commons/interface/keyringpair-info.interface';
import * as fs from 'fs';

import { Logger } from '@nestjs/common';

import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';

export async function GetKeyringPair(
  walletPath: string | undefined,
  walletName: string | undefined,
  walletHotkey: string | undefined,
): Promise<KeyringPairInfo> {
  try {
    const coldkeyPath = `${walletPath}/wallets/${walletName}/coldkeypub.txt`;
    const hotkeyPath = `${walletPath}/wallets/${walletName}/hotkeys/${walletHotkey}`;

    await fs.promises.access(coldkeyPath, fs.constants.R_OK);
    await fs.promises.access(hotkeyPath, fs.constants.R_OK);

    const coldkeyContent = await fs.promises.readFile(coldkeyPath, 'utf-8');
    const coldkeyJsonContent = JSON.parse(coldkeyContent);

    if (!coldkeyJsonContent.ss58Address) {
      throw new Error('Invalid coldkey format: missing ss58Address');
    }
    const coldkey = coldkeyJsonContent.ss58Address;

    const hotkeyFileContent = await fs.promises.readFile(hotkeyPath, 'utf-8');
    const hotkeyJsonContent = JSON.parse(hotkeyFileContent);

    const keyring: Keyring = new Keyring({ type: 'sr25519' });

    let hotkey: KeyringPair;

    if (hotkeyJsonContent.secretPhrase) {
      Logger.log(`Creating keyring pair with mnemonic...`);
      hotkey = keyring.addFromMnemonic(hotkeyJsonContent.secretPhrase);
    } else if (hotkeyJsonContent.secretSeed) {
      Logger.log(`Creating keyring pair with seed...`);
      hotkey = keyring.addFromUri(hotkeyJsonContent.secretSeed);
    } else {
      throw new Error('Invalid hotkey format: missing secretPhrase or secretSeed');
    }

    return {
      keyringPair: hotkey,
      walletColdkey: coldkey,
    };
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(`Failed to get keyring pair: ${error.message}`);
    }
    throw error;
  }
}
