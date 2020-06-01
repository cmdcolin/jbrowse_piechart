define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'JBrowse/Util/FastPromise',
    'JBrowse/View/FeatureGlyph/Box'
],
function (
    declare,
    lang,
    array,
    FastPromise,
    Box,
) {
    return declare(Box, {
        _defaultConfig: function () {
            return this._mergeConfigs(
                this.inherited(arguments),
                {
                    style: {
                        variantColor: 'orange,green,red,blue,yellow,pink,purple'
                    }
                });
        },

        _expandRectangleWithLabels: function (viewInfo, feature, fRect) {
            var height = this._getFeatureHeight(viewInfo, feature);
            fRect.w += height;
            this.inherited(arguments);
        },
        // top and height are in px
        renderBox: function (context, viewInfo, feature, top, overallHeight, parentFeature, style) {
            var left  = viewInfo.block.bpToX(feature.get('start'));
            var width = viewInfo.block.bpToX(feature.get('end')) - left;
            var f = feature;
            var genotypes = f.get('genotypes');
            if (!genotypes) {
                return;
            }
            var alts = (f.get('AF') || {}).values || [];
            const total = alts.reduce((a, b)=>a + b, 0);
            alts = [1 - total, ...alts];

            style = style || lang.hitch(this, 'getStyle');

            var height = this._getFeatureHeight(viewInfo, feature);
            if (!height) {return;}
            if (height != overallHeight) {top += Math.round((overallHeight - height) / 2);}

            context.clearRect(left, top, Math.max(1, width), height);
            height = height / 2;
            let middleX = left + height;
            let middleY = top + height;

            // background
            context.beginPath();
            context.arc(middleX, middleY, height, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
            context.fillStyle = 'black';
            context.fill();
            // end of background
            const colors = style(feature, 'variantColor').split(',');
            let previousRadian = 0;

            alts.forEach((alt, index) => {
                context.beginPath();
                context.fillStyle = colors[index];
                const radian = (Math.PI * 2) * alt;
                context.moveTo(middleX, middleY);
                context.arc(middleX, middleY, height - 1, previousRadian, previousRadian + radian, false);
                context.closePath();
                context.fill();
                context.save();
                context.translate(middleX, middleY);
                context.fillStyle = 'black';
                context.rotate(previousRadian + radian);
                context.restore();

                previousRadian += radian;
            });
        }

    });
});
