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
var __parseRoute = exports.__parseRoute = function __parseRoute(hrefOrRoute) {
    return hrefOrRoute.substring(0, 5) === 'https' ? hrefOrRoute : 'https://api.planningcenteronline.com/services/v2/' + hrefOrRoute;
};
var __apiRequest = exports.__apiRequest = function __apiRequest(options) {
    return function () {
        var urlø1 = __parseRoute(options.route);
        var authø1 = {
            'user': applicationId,
            'pass': applicationSecret
        };
        var qsø1 = options.params || {};
        var cbø1 = options.cb;
        var methodø1 = options.method || 'GET';
        p(colors.magenta(methodø1), urlø1, qsø1);
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
var asyncMap = exports.asyncMap = function asyncMap(items, itemcb, cb) {
    return function () {
        var resultsø1 = items.map(function (it) {
            return void 0;
        });
        var countø1 = items.length;
        return items.forEach(function (item, index) {
            return itemcb(item, function (it) {
                resultsø1[index] = it;
                return resultsø1.every(identity) ? cb(resultsø1) : void 0;
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
var filterItemsWithArrangement = exports.filterItemsWithArrangement = function filterItemsWithArrangement(items) {
    return items.filter(function (it) {
        return it.relationships.arrangement.data;
    });
};
var planItemAttachmentsUrl = exports.planItemAttachmentsUrl = function planItemAttachmentsUrl(planItem) {
    return planItem.links.self + '/arrangement/attachments';
};
var handlePlanItems = exports.handlePlanItems = function handlePlanItems(body) {
    return function () {
        var itemsWithArrangementø1 = filterItemsWithArrangement(body.data);
        var urlsø1 = itemsWithArrangementø1.map(planItemAttachmentsUrl);
        return asyncMap(urlsø1, getSpotifyUrlForAttachments, function (it) {
            return it.forEach(function (it) {
                return p(it);
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFub255bW91cy53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsImlzRXF1YWwiLCJsaXN0IiwibGFzdCIsInN5bWJvbCIsInBsYW5JZCIsImV4cG9ydHMiLCJwcm9jZXNzIiwiYXJndiIsImFwcGxpY2F0aW9uSWQiLCJlbnYuQVBQTElDQVRJT05fSUQiLCJhcHBsaWNhdGlvblNlY3JldCIsImVudi5BUFBMSUNBVElPTl9TRUNSRVQiLCJpZGVudGl0eSIsIngiLCJwIiwiaXRlbSIsImNvbnNvbGUiLCJsb2ciLCJpdGVtcyIsImxvZy5hcHBseSIsIl9fcGFyc2VSb3V0ZSIsImhyZWZPclJvdXRlIiwic3Vic3RyaW5nIiwiX19hcGlSZXF1ZXN0Iiwib3B0aW9ucyIsInVybMO4MSIsInJvdXRlIiwiYXV0aMO4MSIsInFzw7gxIiwicGFyYW1zIiwiY2LDuDEiLCJjYiIsIm1ldGhvZMO4MSIsIm1ldGhvZCIsImNvbG9ycyIsIm1hZ2VudGEiLCJyZXF1ZXN0IiwiZXJyIiwicmVzIiwiYm9keSIsImFwaVJlcXVlc3QiLCJPYmplY3QiLCJhc3NpZ24iLCJhc3luY01hcCIsIml0ZW1jYiIsInJlc3VsdHPDuDEiLCJtYXAiLCJjb3VudMO4MSIsImxlbmd0aCIsImZvckVhY2giLCJpbmRleCIsIml0IiwiZXZlcnkiLCJtYWluIiwiZ2V0UGxhblVyaVRoZW5JdGVtcyIsInJlcXVlc3QudXJpLmhyZWYiLCJoYW5kbGVQbGFuSXRlbXMiLCJmaWx0ZXJJdGVtc1dpdGhBcnJhbmdlbWVudCIsImZpbHRlciIsInJlbGF0aW9uc2hpcHMuYXJyYW5nZW1lbnQuZGF0YSIsInBsYW5JdGVtQXR0YWNobWVudHNVcmwiLCJwbGFuSXRlbSIsImxpbmtzLnNlbGYiLCJpdGVtc1dpdGhBcnJhbmdlbWVudMO4MSIsImRhdGEiLCJ1cmxzw7gxIiwiZ2V0U3BvdGlmeVVybEZvckF0dGFjaG1lbnRzIiwiaXNTcG90aWZ5QXR0YWNobWVudCIsImF0dGFjaG1lbnQiLCJhdHRyaWJ1dGVzLnBjb190eXBlIiwiYXR0YWNobWVudHNVcmwiLCJzcG90aWZ5QXR0YWNobWVudMO4MSIsImZpbmQiLCJvcGVuQXR0YWNobWVudCIsInNwb3RpZnlPcGVuVXJsVG9TcG90aWZ5VXJpIiwiZGF0YS5hdHRyaWJ1dGVzLmF0dGFjaG1lbnRfdXJsIiwidXJsIiwiaWTDuDEiLCJzcGxpdCJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSwwQkFBSjtBQUFBLFFBQUFDLEcsRUFDRSw0Q0FERjtBQUFBLE07Ozs7O1FBSWtDQyxPQUFBLEcsYUFBQUEsTzs7UUFFYkMsSUFBQSxHLGNBQUFBLEk7UUFBS0MsSUFBQSxHLGNBQUFBLEk7UUFBS0MsTUFBQSxHLGNBQUFBLE07O0FBRS9CLElBQUtDLE1BQUEsR0FBQUMsT0FBQSxDQUFBRCxNQUFBLEcsQ0FBYUUsT0FBQSxDQUFRQyxJLE1BQWIsQ0FBa0IsQ0FBbEIsQ0FBYixDO0FBQ0EsSUFBS0MsYUFBQSxHQUFBSCxPQUFBLENBQUFHLGFBQUEsR0FBcUNGLE9BQXRCLENBQUdHLGtCQUF2QixDO0FBQ0EsSUFBS0MsaUJBQUEsR0FBQUwsT0FBQSxDQUFBSyxpQkFBQSxHQUE2Q0osT0FBMUIsQ0FBR0ssc0JBQTNCLEM7QUFFQSxJQUFNQyxRQUFBLEdBQUFQLE9BQUEsQ0FBQU8sUUFBQSxHQUFOLFNBQU1BLFFBQU4sQ0FBZ0JDLENBQWhCLEVBQW1CO0FBQUEsV0FBQUEsQ0FBQTtBQUFBLENBQW5CLEM7O0FBS0EsSUFBTUMsQ0FBQSxHQUFBVCxPQUFBLENBQUFTLENBQUEsR0FBTixTQUFNQSxDQUFOLEc7Ozs7O1lBRUlDLElBQUEsRztRQUFNLE8sYUFBSTtBQUFBLFlBQUNDLE9BQUEsQ0FBUUMsR0FBVCxDQUFhRixJQUFiO0FBQUEsWUFBbUIsT0FBQUEsSUFBQSxDQUFuQjtBQUFBLFMsQ0FBQSxFQUFKLEM7O1lBQ0pHLEtBQUEsRztRQUFPLE8sYUFBSTtBQUFBLFlBQUNGLE9BQUEsQ0FBUUcsU0FBVCxDQUFtQkgsT0FBbkIsRUFBMkJF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QyxFQUFtRCxFLFVBQVUsTUFBVixFQUFuRCxFQUFzRS9CLEVBQXRFO0FBQUEsQ0FERixDO0FBR0EsSUFBTTJDLDBCQUFBLEdBQUFyRSxPQUFBLENBQUFxRSwwQkFBQSxHQUFOLFNBQU1BLDBCQUFOLENBQXVDRSxHQUF2QyxFQUNFO0FBQUEsVyxZQUFNO0FBQUEsWUFBQUMsSSxHQUFJM0UsSUFBRCxDQUFjMEUsR0FBUCxDQUFDRSxLQUFGLENBQVksR0FBWixDQUFOLENBQUg7QUFBQSxRQUNKLE9BQUcsZ0JBQUgsR0FBb0JELElBQXBCLENBREk7QUFBQSxLLEtBQU4sQyxJQUFBO0FBQUEsQ0FERixDO0FBSUN4QixJQUFEIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHNlcnZpY2VzLXBsYW4tdG8tc3BvdGlmeVxuICBcIml0IGJ1aWxkcyBzcG90aWZ5IHBsYXlsaXN0cyBmcm9tIHBjbyBwbGFuc1wiXG4gICg6cmVxdWlyZSByZXF1ZXN0XG4gICAgICAgICAgICBbY29sb3JzLnNhZmUgOmFzIGNvbG9yc11cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtpc0VxdWFsXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlXG4gICAgICAgICAgICAgOnJlZmVyIFtsaXN0IGxhc3Qgc3ltYm9sXV0pKVxuXG4oZGVmIHBsYW4taWQgKGdldCBwcm9jZXNzLmFyZ3YgMikpXG4oZGVmIGFwcGxpY2F0aW9uLWlkICguLWVudi5BUFBMSUNBVElPTl9JRCBwcm9jZXNzKSlcbihkZWYgYXBwbGljYXRpb24tc2VjcmV0ICguLWVudi5BUFBMSUNBVElPTl9TRUNSRVQgcHJvY2VzcykpXG5cbihkZWZuIGlkZW50aXR5IFt4XSB4KVxuXG4oZGVmbWFjcm8gPiBbJiBmb3Jtc11cbiAgYChmbiBbaXRdIH5AZm9ybXMpKVxuXG4oZGVmbiBwXG4gIChbXSBuaWwpXG4gIChbaXRlbV0gKGRvIChjb25zb2xlLmxvZyBpdGVtKSBpdGVtKSlcbiAgKFsmIGl0ZW1zXSAoZG8gKGNvbnNvbGUubG9nLmFwcGx5IGNvbnNvbGUgaXRlbXMpIGl0ZW1zKSkpXG5cbihkZWZuIC0tcGFyc2Utcm91dGUgW2hyZWYtb3Itcm91dGVdXG4gIChpZiAoaWRlbnRpY2FsPyAoLnN1YnN0cmluZyBocmVmLW9yLXJvdXRlIDAgNSkgXCJodHRwc1wiKVxuICAgIGhyZWYtb3Itcm91dGVcbiAgICAoKyBcImh0dHBzOi8vYXBpLnBsYW5uaW5nY2VudGVyb25saW5lLmNvbS9zZXJ2aWNlcy92Mi9cIiBocmVmLW9yLXJvdXRlKSkpXG5cbihkZWZuIC0tYXBpLXJlcXVlc3QgW29wdGlvbnNdXG4gIChsZXQgW3VybCAoLS1wYXJzZS1yb3V0ZSAoLi1yb3V0ZSBvcHRpb25zKSlcbiAgICAgICAgYXV0aCB7IDp1c2VyIGFwcGxpY2F0aW9uLWlkIDpwYXNzIGFwcGxpY2F0aW9uLXNlY3JldCB9XG4gICAgICAgIHFzIChvciAoLi1wYXJhbXMgb3B0aW9ucykge30pXG4gICAgICAgIGNiICguLWNiIG9wdGlvbnMpXG4gICAgICAgIG1ldGhvZCAob3IgKC4tbWV0aG9kIG9wdGlvbnMpIFwiR0VUXCIpXVxuICAgIChwIChjb2xvcnMubWFnZW50YSBtZXRob2QpIHVybCBxcylcbiAgICAocmVxdWVzdCB7IDp1cmwgdXJsIDpqc29uIHRydWUgOmF1dGggYXV0aCA6cXMgcXMgOm1ldGhvZCBtZXRob2QgfVxuICAgICAgICAgICAgIChmbiBbZXJyLCByZXMsIGJvZHldIChpZiBlcnIgKHRocm93IGVycikpIChjYiBib2R5IHJlcykpKSkpXG5cbihkZWZuIGFwaS1yZXF1ZXN0XG4gIChbcm91dGUgY2JdICgtLWFwaS1yZXF1ZXN0IHsgOnJvdXRlIHJvdXRlIDpjYiBjYiB9KSlcbiAgKFtyb3V0ZSBvcHRpb25zIGNiXSAoLS1hcGktcmVxdWVzdCAoT2JqZWN0LmFzc2lnbiB7IDpyb3V0ZSByb3V0ZSA6Y2IgY2IgfSBvcHRpb25zKSkpKVxuXG4oZGVmbiBhc3luYy1tYXAgW2l0ZW1zIGl0ZW1jYiBjYl1cbiAgKGxldCBbcmVzdWx0cyAoLm1hcCBpdGVtcyAoPiBuaWwpKVxuICAgICAgICBjb3VudCAoLi1sZW5ndGggaXRlbXMpXVxuICAgICguZm9yRWFjaCBpdGVtc1xuICAgICAgICAgICAgICAoZm4gW2l0ZW0gaW5kZXhdXG4gICAgICAgICAgICAgICAgKGl0ZW1jYiBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAoPlxuICAgICAgICAgICAgICAgICAgICAgICAgIChhc2V0IHJlc3VsdHMgaW5kZXggaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGlmICguZXZlcnkgcmVzdWx0cyBpZGVudGl0eSkgKGNiIHJlc3VsdHMpKSkpKSkpKVxuXG4oZGVmbiBtYWluIFtdXG4gIChhcGktcmVxdWVzdCAoKyBcInBsYW5zL1wiIHBsYW4taWQpIGdldC1wbGFuLXVyaS10aGVuLWl0ZW1zKSlcblxuKGRlZm4gZ2V0LXBsYW4tdXJpLXRoZW4taXRlbXMgW2JvZHkgcmVzXVxuICAoYXBpLXJlcXVlc3QgKCsgKC4tcmVxdWVzdC51cmkuaHJlZiByZXMpIFwiL2l0ZW1zXCIpIGhhbmRsZS1wbGFuLWl0ZW1zKSlcblxuKGRlZm4gZmlsdGVyLWl0ZW1zLXdpdGgtYXJyYW5nZW1lbnQgW2l0ZW1zXVxuICAoLmZpbHRlciBpdGVtcyAoPiAoLi1yZWxhdGlvbnNoaXBzLmFycmFuZ2VtZW50LmRhdGEgaXQpKSkpXG5cbihkZWZuIHBsYW4taXRlbS1hdHRhY2htZW50cy11cmwgW3BsYW4taXRlbV1cbiAgKCsgKC4tbGlua3Muc2VsZiBwbGFuLWl0ZW0pIFwiL2FycmFuZ2VtZW50L2F0dGFjaG1lbnRzXCIpKVxuXG4oZGVmbiBoYW5kbGUtcGxhbi1pdGVtcyBbYm9keV1cbiAgKGxldCBbaXRlbXMtd2l0aC1hcnJhbmdlbWVudCAoZmlsdGVyLWl0ZW1zLXdpdGgtYXJyYW5nZW1lbnQgKC4tZGF0YSBib2R5KSlcbiAgICAgICAgdXJscyAoLm1hcCBpdGVtcy13aXRoLWFycmFuZ2VtZW50IHBsYW4taXRlbS1hdHRhY2htZW50cy11cmwpXVxuICAgIChhc3luYy1tYXAgdXJsc1xuICAgICAgICAgICAgICAgZ2V0LXNwb3RpZnktdXJsLWZvci1hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgKD4gKC5mb3JFYWNoIGl0ICg+IChwIGl0KSkpKSkpKVxuXG4oZGVmbiBzcG90aWZ5LWF0dGFjaG1lbnQ/IFthdHRhY2htZW50XVxuICAoaWRlbnRpY2FsPyAoLi1hdHRyaWJ1dGVzLnBjb190eXBlIGF0dGFjaG1lbnQpIFwiQXR0YWNobWVudFNwb3RpZnlcIikpXG5cbihkZWZuIGdldC1zcG90aWZ5LXVybC1mb3ItYXR0YWNobWVudHMgW2F0dGFjaG1lbnRzLXVybCBjYl1cbiAgKGFwaS1yZXF1ZXN0IGF0dGFjaG1lbnRzLXVybFxuICAgICAgICAgICAgICAgKD4gKGxldCBbc3BvdGlmeS1hdHRhY2htZW50ICguZmluZCAoLi1kYXRhIGl0KSBzcG90aWZ5LWF0dGFjaG1lbnQ/KV1cbiAgICAgICAgICAgICAgICAgICAgKGlmIHNwb3RpZnktYXR0YWNobWVudFxuICAgICAgICAgICAgICAgICAgICAgIChvcGVuLWF0dGFjaG1lbnQgc3BvdGlmeS1hdHRhY2htZW50ICg+IChjYiAoc3BvdGlmeS1vcGVuLXVybC10by1zcG90aWZ5LXVyaSAoLi1kYXRhLmF0dHJpYnV0ZXMuYXR0YWNobWVudF91cmwgaXQpKSkpKSkpKSkpXG5cbihkZWZuIG9wZW4tYXR0YWNobWVudCBbYXR0YWNobWVudCBjYl1cbiAgKGFwaS1yZXF1ZXN0ICgrICguLWxpbmtzLnNlbGYgYXR0YWNobWVudCkgXCIvb3BlblwiKSB7IDptZXRob2QgXCJQT1NUXCIgfSBjYikpXG5cbihkZWZuIHNwb3RpZnktb3Blbi11cmwtdG8tc3BvdGlmeS11cmkgW3VybF1cbiAgKGxldCBbaWQgKGxhc3QgKC5zcGxpdCB1cmwgXCIvXCIpKV1cbiAgICAoKyBcInNwb3RpZnk6dHJhY2s6XCIgaWQpKSlcblxuKG1haW4pXG4iXX0=
