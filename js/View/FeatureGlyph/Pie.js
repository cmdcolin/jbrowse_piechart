define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'JBrowse/Util/FastPromise',
    'JBrowse/View/FeatureGlyph/Box',
    'JBrowse/Util',
    'JBrowse/Model/NestedFrequencyTable'
],
function (
    declare,
    lang,
    array,
    FastPromise,
    Box,
    Util,
    NestedFrequencyTable
) {
    return declare(Box, {
        _defaultConfig: function () {
            return this._mergeConfigs(
                this.inherited(arguments),
                {
                    style: {
                        variantColor: 'green',
                        nonvariantColor: 'orange'
                    }
                });
        },

        _expandRectangleWithLabels: function (viewInfo, feature, fRect) {
            var height = this._getFeatureHeight(viewInfo, feature);
            fRect.w += height;
            this.inherited(arguments);
        },
        // similar to code in _VariantDetailMixin in jbrowse core
        calculateGenotypeFrequencies: function (genotypes, alt) {
            var counts = new NestedFrequencyTable();
            for (var gname in genotypes) {
                if (genotypes.hasOwnProperty(gname)) {
                // increment the appropriate count
                    var gtVals = (genotypes[gname].GT || {}).values;
                    if (gtVals === null || gtVals === undefined) gtVals = ['.'];
                    var gt = gtVals[0].split(/\||\//);
                    if (lang.isArray(gt)) {
                    // if all zero, non-variant/hom-ref
                        if (array.every(gt, function (g) { return parseInt(g, 10) == 0; })) {
                            counts.getNested('non-variant').increment('homozygous for reference');
                        } else if (array.every(gt, function (g) { return g == '.'; })) {
                            counts.getNested('non-variant').increment('no call');
                        } else if (array.every(gt, function (g, t, a) { return g == a[0]; })) {
                            if (alt) {counts.getNested('variant/homozygous').increment(alt[ parseInt(gt[0], 10) - 1 ] + ' variant');} else {counts.getNested('variant').increment('homozygous');}
                        } else {
                            counts.getNested('variant').increment('heterozygous');
                        }
                    }
                }
            }
            return counts;
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
            var alt = (f.get('alternative_alleles') || {}).values;
            const counts = this.calculateGenotypeFrequencies(genotypes, alt);
            const total = counts.total();

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
            const colors = {
                'variant': style(feature, 'variantColor'),
                'non-variant': style(feature, 'nonvariantColor')
            };
            let previousRadian = 0;
            const categories = counts.categories();

            categories.forEach(category => {
                const count = counts.get(category);
                context.beginPath();
                context.fillStyle = colors[category];
                const radian = (Math.PI * 2) * (count / total);
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
