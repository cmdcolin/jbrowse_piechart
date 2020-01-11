define([
    'dojo/_base/declare',
    'JBrowse/Plugin'
],
function (
    declare,
    JBrowsePlugin
) {
    return declare(JBrowsePlugin, {
        constructor: function () {
            // Do anything you need to initialize your plugin here
            console.log('PiechartPlugin plugin starting');
        }
    });
});
