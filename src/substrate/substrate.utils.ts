import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { KeyringPairInfo } from './substrate.interface';

export async function getKeyringPair(
  walletPath: string,
  walletName: string,
  walletHotkey: string,
): Promise<KeyringPairInfo> {
  try {
    const coldkeyPath = `${walletPath}/${walletName}/coldkeypub.txt`;
    const hotkeyPath = `${walletPath}/${walletName}/hotkeys/${walletHotkey}`;

    console.log('Coldkey Path:', coldkeyPath);
    console.log('Hotkey Path:', hotkeyPath);

    await fs.promises.access(coldkeyPath, fs.constants.R_OK);
    await fs.promises.access(hotkeyPath, fs.constants.R_OK);

    console.log('Coldkey and Hotkey files are accessible.');

    const coldkeyContent = await fs.promises.readFile(coldkeyPath, 'utf-8');
    const coldkeyJsonContent = JSON.parse(coldkeyContent);

    console.log('Coldkey JSON Content:', coldkeyJsonContent);

    if (!coldkeyJsonContent.ss58Address) {
      throw new Error('Invalid coldkey format: missing ss58Address');
    }
    const coldkey = coldkeyJsonContent.ss58Address;

    const hotkeyFileContent = await fs.promises.readFile(hotkeyPath, 'utf-8');
    const hotkeyJsonContent = JSON.parse(hotkeyFileContent);

    if (!hotkeyJsonContent.secretPhrase) {
      throw new Error('Invalid hotkey format: missing secretPhrase');
    }

    const keyring: Keyring = new Keyring({ type: 'sr25519' });
    const hotkey: KeyringPair = keyring.addFromMnemonic(hotkeyJsonContent.secretPhrase);

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

export async function ipToInt(strVal: string): Promise<number | bigint> {
  if (strVal.indexOf(':') === -1) {
    const parts = strVal.split('.');
    if (parts.length !== 4) {
      throw new Error('Invalid IPv4 address format');
    }

    return parts.reduce((acc, octet) => {
      return (acc << 8) + parseInt(octet, 10);
    }, 0);
  } else {
    const addr = await normalizeIPv6(strVal);
    const parts = addr.split(':');

    return parts.reduce((acc: bigint, hextet) => {
      return (acc << 16n) + BigInt(parseInt(hextet, 16));
    }, 0n);
  }
}

export async function normalizeIPv6(ip: string): Promise<string> {
  if (ip.includes('::')) {
    const parts = ip.split('::');
    const missing =
      8 - (parts[0].split(':').filter(Boolean).length + parts[1].split(':').filter(Boolean).length);
    const zeroes = Array(missing).fill('0').join(':');

    ip = parts[0] + ':' + (parts[0] && zeroes ? zeroes + ':' : zeroes) + parts[1];
  }

  return ip
    .split(':')
    .map((segment) => {
      return segment.length === 0 ? '0' : segment.padStart(4, '0');
    })
    .join(':');
}
