# piechart_plugin

A JBrowse plugin for plotting allele frequencies as a track glyph


Screenshot

![](img/t11.png)

Showing 1000 genomes psuedo data variant and non-variant frequencies


Example config

    {
        "label": "Allele frequencies",
        "urlTemplate": "file.test.vcf.gz",
        "glyph": "PiechartPlugin/View/FeatureGlyph/Pie",
        "style": {
            "variantColor": "brown",
            "nonvariantColor": "purple"
        }
    }

In tracks.conf format

    [tracks.allele_freq]
    key=Allele frequencies
    urlTemplate=volvox.test.vcf.gz
    glyph=PiechartPlugin/View/FeatureGlyph/Pie



## Known issues

The circular glyph is not given enough proper space to render so features can overlap slightly and the block boundaries can cause issues

## Test data

See test/data/ folder for example

Visit http://localhost/jbrowse/?data=plugins/PiechartPlugin/test/data to verify your installation

## Installation

Clone the repository to the jbrowse plugins subdirectory and name it PiechartPlugin

    git clone https://github.com/cmdcolin/jbrowse_piechart PiechartPlugin

Then add the plugin to your configuration, e.g. "plugins": ["PiechartPlugin"]

See http://gmod.org/wiki/JBrowse_FAQ#How_do_I_install_a_plugin for details
