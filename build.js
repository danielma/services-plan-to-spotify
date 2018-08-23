{
    var _ns_ = {
        id: 'services-plan-to-spotify',
        doc: 'it builds spotify playlists from pco plans'
    };
    var request = require('request');
    var colors_safe = require('colors/safe');
    var colors = colors_safe;
    var wisp_runtime = require('wisp/runtime');
    var isEqual = wisp_runtime.isEqual;
    var wisp_sequence = require('wisp/sequence');
    var list = wisp_sequence.list;
    var last = wisp_sequence.last;
    var symbol = wisp_sequence.symbol;
    var map = wisp_sequence.map;
    var filter = wisp_sequence.filter;
}
var planId = exports.planId = (process.argv || 0)[2];
var applicationId = exports.applicationId = process.env.APPLICATION_ID;
var applicationSecret = exports.applicationSecret = process.env.APPLICATION_SECRET;
var identity = exports.identity = function identity(x) {
    return x;
};
void 0;
var p = exports.p = function p() {
    switch (arguments.length) {
    case 0:
        return void 0;
    case 1:
        var item = arguments[0];
        return (function () {
            console.log(item);
            return item;
        })();
    default:
        var items = Array.prototype.slice.call(arguments, 0);
        return (function () {
            console.log.apply(console, items);
            return items;
        })();
    }
};
var __urlFromRouteOrUrl = exports.__urlFromRouteOrUrl = function __urlFromRouteOrUrl(urlOrRoute) {
    return urlOrRoute.substring(0, 5) === 'https' ? urlOrRoute : 'https://api.planningcenteronline.com/services/v2/' + urlOrRoute;
};
var __routeFromUrlOrRoute = exports.__routeFromUrlOrRoute = function __routeFromUrlOrRoute(routeOrUrl) {
    return routeOrUrl.substring(0, 5) === 'https' ? routeOrUrl.substring(49) : routeOrUrl;
};
var __apiRequest = exports.__apiRequest = function __apiRequest(options) {
    return function () {
        var routeOrUrlø1 = options.route;
        var urlø1 = __urlFromRouteOrUrl(routeOrUrlø1);
        var authø1 = {
            'user': applicationId,
            'pass': applicationSecret
        };
        var qsø1 = options.params || {};
        var cbø1 = options.cb;
        var methodø1 = options.method || 'GET';
        p(colors.magenta(methodø1), __routeFromUrlOrRoute(routeOrUrlø1), qsø1);
        return request({
            'url': urlø1,
            'json': true,
            'auth': authø1,
            'qs': qsø1,
            'method': methodø1
        }, function (err, res, body) {
            err ? (function () {
                throw err;
            })() : void 0;
            return cbø1(body, res);
        });
    }.call(this);
};
var apiRequest = exports.apiRequest = function apiRequest() {
    switch (arguments.length) {
    case 2:
        var route = arguments[0];
        var cb = arguments[1];
        return __apiRequest({
            'route': route,
            'cb': cb
        });
    case 3:
        var route = arguments[0];
        var options = arguments[1];
        var cb = arguments[2];
        return __apiRequest(Object.assign({
            'route': route,
            'cb': cb
        }, options));
    default:
        throw RangeError('Wrong number of arguments passed');
    }
};
var asyncMap = exports.asyncMap = function asyncMap(itemcb, items, cb) {
    return function () {
        var resultsø1 = map(function (it) {
            return '__unset__';
        }, items);
        var countø1 = items.length;
        return items.map(function (item, index) {
            return itemcb(item, function (it) {
                resultsø1[index] = it;
                return resultsø1.every(function (it) {
                    return !isEqual(it, '__unset__');
                }) ? cb(resultsø1) : void 0;
            });
        });
    }.call(this);
};
var main = exports.main = function main() {
    return apiRequest('plans/' + planId, getPlanUriThenItems);
};
var getPlanUriThenItems = exports.getPlanUriThenItems = function getPlanUriThenItems(body, res) {
    return apiRequest(res.request.uri.href + '/items', handlePlanItems);
};
var planItemAttachmentsUrl = exports.planItemAttachmentsUrl = function planItemAttachmentsUrl(planItem) {
    return planItem.links.self + '/arrangement/attachments';
};
var handlePlanItems = exports.handlePlanItems = function handlePlanItems(body) {
    return function () {
        var itemsWithArrangementø1 = filter(function (it) {
            return it.relationships.arrangement.data;
        }, body.data);
        var urlsø1 = map(planItemAttachmentsUrl, itemsWithArrangementø1);
        return asyncMap(getSpotifyUrlForAttachments, urlsø1, function (it) {
            p('----------------------------------------------------------------------------------');
            p('Copy and paste these tracks into the Spotify app to add these tracks to a playlist');
            p('----------------------------------------------------------------------------------');
            return p(it.join('\n'));
        });
    }.call(this);
};
var isSpotifyAttachment = exports.isSpotifyAttachment = function isSpotifyAttachment(attachment) {
    return attachment.attributes.pco_type === 'AttachmentSpotify';
};
var getSpotifyUrlForAttachments = exports.getSpotifyUrlForAttachments = function getSpotifyUrlForAttachments(attachmentsUrl, cb) {
    return apiRequest(attachmentsUrl, function (it) {
        return function () {
            var spotifyAttachmentø1 = it.data.find(isSpotifyAttachment);
            return spotifyAttachmentø1 ? openAttachment(spotifyAttachmentø1, function (it) {
                return cb(spotifyOpenUrlToSpotifyUri(it.data.attributes.attachment_url));
            }) : void 0;
        }.call(this);
    });
};
var openAttachment = exports.openAttachment = function openAttachment(attachment, cb) {
    return apiRequest(attachment.links.self + '/open', { 'method': 'POST' }, cb);
};
var spotifyOpenUrlToSpotifyUri = exports.spotifyOpenUrlToSpotifyUri = function spotifyOpenUrlToSpotifyUri(url) {
    return function () {
        var idø1 = last(url.split('/'));
        return 'spotify:track:' + idø1;
    }.call(this);
};
main();