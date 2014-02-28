var expect = require('expect.js'),
  GifInterpolator = require('../src/modules/gif_interpolator');

describe('GifInterpolator', function(){
  describe('#go()', function(){
    it('should do something', function(){
      expect(new GifInterpolator().go()).to.be("WAT")
      expect([1,2,3].indexOf(5)).to.be(-1);
      expect([1,2,3].indexOf(-1)).to.be(-1);
    })
  })
})
