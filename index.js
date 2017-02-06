/**
 * Created by macdja38 on 2017-02-05.
 */

let sodium = require('sodium').api;
let sodiumEncryption = require('sodium-encryption');
let nacl = require('tweetnacl');
let sodiumNative = require('sodium-native');

let sender = sodium.crypto_box_keypair();

let nonce = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);
sodium.randombytes_buf(nonce);

let secretMessage = Buffer.allocUnsafe(3876);
sodium.randombytes_buf(secretMessage);

let Benchmark = require('benchmark');

let suite = new Benchmark.Suite;

function onCycle() {
  sodium.randombytes_buf(nonce);
  sodium.randombytes_buf(secretMessage);
}

function makeCipher() {
  return new Buffer(3876 + sodiumNative.crypto_secretbox_MACBYTES);
}

let cipher = new Buffer(3876 + sodiumNative.crypto_secretbox_MACBYTES);

let usedCiphers = [];
let unusedCiphers = [];


// add tests
suite
  .add('sodium', {
    onCycle,
    fn: function () {
      sodium.crypto_secretbox(secretMessage, nonce, sender.secretKey);
    }
  })
  .add('sodium-native', {
    onCycle,
    fn: function () {
      let cipher = new Buffer(3876 + sodiumNative.crypto_secretbox_MACBYTES);
      sodiumNative.crypto_secretbox_easy(cipher, secretMessage, nonce, sender.secretKey);
    }
  })
  .add('sodium-native-pool', {
    onCycle,
    fn: function () {
      let cipher;
      if (unusedCiphers.length < 100) {
        if (usedCiphers.length > 100) {
          cipher = usedCiphers.pop();
        } else {
          cipher = makeCipher();
          unusedCiphers.push(cipher);
        }
      } else {
        cipher = unusedCiphers.pop();
        usedCiphers.push(cipher);
      }
      sodiumNative.crypto_secretbox_easy(cipher, secretMessage, nonce, sender.secretKey);
    }
  })
  .add('sodium-native-same-buffer', {
    onCycle,
    fn: function () {
      sodiumNative.crypto_secretbox_easy(cipher, secretMessage, nonce, sender.secretKey);
    }
  })
  .add('sodiumEncryption', {
    onCycle,
    fn: function () {
      sodiumEncryption.encrypt(secretMessage, nonce, sender.secretKey);
    }
  })
  .add('tweetnacl', {
    onCycle,
    fn: function () {
      nacl.secretbox(secretMessage, nonce, sender.secretKey);
    }
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({'async': false});