define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/Util/FastPromise',
           'JBrowse/Util/GenotypeUtil',
           'JBrowse/View/FeatureGlyph/Box',
           'JBrowse/Util',
        ],
       function(
           declare,
           lang,
           FastPromise,
           GenotypeUtil,
           Box,
           Util,
       ) {


return declare(Box, {
    _defaultConfig: function() {
        return this._mergeConfigs(
            this.inherited(arguments),
            {
              style: {
                variantColor: 'green',
                nonvariantColor: 'orange'
              }
            });
    },

    // top and height are in px
    renderBox: function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {
        var left  = viewInfo.block.bpToX( feature.get('start') );
        var width = viewInfo.block.bpToX( feature.get('end') ) - left;
        var f = feature
        var genotypes = f.get('genotypes')
        if (!genotypes) {
            return
        }
        var alt = (f.get('alternative_alleles') || {}).values;
        const counts = GenotypeUtil.calculateGenotypeFrequencies(genotypes, alt)
        const total = counts.total()

        style = style || lang.hitch( this, 'getStyle' );

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height )
            return;
        if( height != overallHeight )
            top += Math.round( (overallHeight - height)/2 );

        context.clearRect(left,top,Math.max(1,width), height)
      height = height/2
      let middleX = left + height/2
      let middleY = top + height

        //background
        context.beginPath();
        context.arc(middleX, middleY, height, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.fillStyle = "black";
        context.fill();
         //end of background
        const colors = {
          'variant': style(feature,'variantColor'),
          'non-variant':style(feature,'nonvariantColor')
        }
        let previousRadian = 0
        const categories = counts.categories()

        categories.forEach((category, i) => {
          const count = counts.get(category)
          context.beginPath();
          context.fillStyle = colors[category]
          const radian = (Math.PI * 2) * (count / total);
          context.moveTo(middleX, middleY);
          context.arc(middleX, middleY, height - 1, previousRadian, previousRadian + radian, false);
          context.closePath();
          context.fill();
          context.save();
          context.translate(middleX, middleY);
          context.fillStyle = "black";
          context.rotate(previousRadian + radian);
          context.restore();

          previousRadian += radian;
        })
    },

});
});
