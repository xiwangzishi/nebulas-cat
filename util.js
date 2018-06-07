function leftPadZero(s) {
  return ("0" + s).substr(-2)
}

function makeTxHash(nums) {
  var text = "",
    possible = "abcdefghijklmnopqrstuvwxyz0123456789",
    nums = nums || 64;
  var maxAt = possible.length - 1
  for (var i = 0; i < nums; i++) {
    var random = jsMath.floor(jsMathRandom() * (0 - maxAt) + maxAt)
    text += possible.charAt(random);
  }
  return text;
}

function makeBlock() {
  var date = new jsDate(),
      ts = parseInt(date.getTime() / 1000);
  var block = {
    timestamp: ts,
    height: date.getFullYear() + leftPadZero(date.getMonth() + 1) + leftPadZero(date.getDate()) + leftPadZero(date.getHours()) + leftPadZero(date.getMinutes()),
    seed: ts.toString()
  };
  return block
}

module.exports = {
  makeTxHash: makeTxHash,
  makeBlock:makeBlock,
}