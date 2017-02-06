/**
 * Created by macdja38 on 2017-02-05.
 */

let sodium = require('sodium').api;

let sender = sodium.crypto_box_keypair();

let nonce = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);
sodium.randombytes_buf(nonce);

let secretMessage = Buffer.allocUnsafe(3876);
sodium.randombytes_buf(secretMessage);

let nacl = require('tweetnacl');

let Benchmark = require('benchmark');

let suite = new Benchmark.Suite;

function onCycle() {
  sodium.randombytes_buf(nonce);
  sodium.randombytes_buf(secretMessage);
}

// add tests
suite
  .add('libsodium', {
    onCycle,
    fn: function () {
      sodium.crypto_secretbox(secretMessage, nonce, sender.secretKey);
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