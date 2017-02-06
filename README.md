# salt-bench-test

Benchmark suit setup to test readily available libsodium builds secretbox encrypting speed

Run on an i7 3770k with 1330hz DDR3 memory it results in
  ```
  sodium x 26,360 ops/sec ±4.68% (83 runs sampled)
  sodium-native x 29,325 ops/sec ±1.23% (92 runs sampled)
  sodium-native-pool x 30,828 ops/sec ±0.74% (89 runs sampled)
  sodium-native-same-buffer x 30,032 ops/sec ±2.09% (88 runs sampled)
  sodiumEncryption x 14,017 ops/sec ±2.30% (82 runs sampled)
  tweetnacl x 16,522 ops/sec ±2.19% (82 runs sampled)
  Fastest is sodium-native-pool,sodium-native-same-buffer
  ```
If you would like another library added to this please create an issue or submit a pr, if you have any reason to believe this test may be giving one library an unfair advantage please inform me.

the sodium-native-pool and sodium-same-buffer are tests to attempt to take into account the different method of outputting values, instead of returning a result sodium-native writes it into an existing buffer which from my personal understanding can be used to improve preformance by reducing object creation. The sodium-native-pool test may well be flawed but was designed to simulate array operations to handle a pool that could possibly be recycled.
