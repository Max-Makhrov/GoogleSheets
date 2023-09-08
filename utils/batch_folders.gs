/**
 * @typedef {Object} BatchFolderInfo
 * @property {String} id
 * @property {String} name
 * @property {String} mimeType
 * @property {String} teamDriveId
 * @property {String} driveId
 */

/**
 * Also works with Shared Drives!
 * 
 * @param {String} folderId
 * @param {Array<String>} folderNames
 * 
 * @returns{Array<BatchFolderInfo>}
 */
function batchCreateFolders_(folderId, folderNames) {
  var batchReqs = []
  for (var i = 0; i < folderNames.length; i++) {
    batchReqs.push({
      method: "POST",
      endpoint: "https://www.googleapis.com/drive/v3/files?supportsAllDrives=true",
      requestBody: { name: folderNames[i], mimeType: MimeType.FOLDER, parents: [folderId] }
    });
  }
  var result = EDo({ batchPath: "batch/drive/v3", requests: batchReqs });
  return result;
}


/* lib +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ */

/**
 * GitHub  https://github.com/tanaikech/BatchRequest<br>
 * Run BatchRequest<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function Do(object) {
    return new BatchRequest(object).Do();
}

/**
 * Run enhanced "Do" method of BatchRequest. Requests more than 100 can be used and the result values are parsed.<br>
 * @param {Object} Object Object
 * @return {Object} Return Object
 */
function EDo(object) {
    return new BatchRequest(object).EDo();
}

/**
 * Get batch path for using batch requests. On August 12, 2020, in order to use batch requests, the batch path is required to be used to the endpoint of the batch requests..<br>
 * @param {string} name Name of Google API you want to use. For example, when you want to use Drive API, please put "drive".
 * @param {string} version Version of Google API you want to use. For example, when you want to use Drive API v2, please put "v2". When this is not used, the latest version is used as the default.
 * @return {Object} Return Object
 */
function getBatchPath(name, version) {
    return new BatchRequest("getBatchPath").getBatchPath(name, version);
}
;
(function(r) {
  var BatchRequest;
  BatchRequest = (function() {
    var createRequest, parser, parserAsBinary, splitByteArrayBySearchData;

    BatchRequest.name = "BatchRequest";

    function BatchRequest(p_) {
      var bP, batchPath;
      if (typeof p_ === "object") {
        if (!p_.hasOwnProperty("requests")) {
          throw new Error("'requests' property was not found in object.");
        }
        this.p = p_.requests.slice();
        this.url = "https://www.googleapis.com/batch";
        if (p_.batchPath) {
          bP = p_.batchPath.trim();
          batchPath = "";
          if (~bP.indexOf("batch/")) {
            batchPath = bP.replace("batch", "");
          } else {
            batchPath = bP.slice(0, 1) === "/" ? bP : "/" + bP;
          }
          this.url += batchPath;
        }
        this.at = p_.accessToken || ScriptApp.getOAuthToken();
        this.lb = "\r\n";
        this.boundary = "xxxxxxxxxx";
        this.useFetchAll = "useFetchAll" in p_ ? p_.useFetchAll : false;
        this.exportDataAsBlob = "exportDataAsBlob" in p_ ? p_.exportDataAsBlob : false;
      }
    }

    BatchRequest.prototype.Do = function() {
      var e, params, res;
      try {
        params = createRequest.call(this, this.p);
        res = UrlFetchApp.fetch(this.url, params);
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      return res;
    };

    BatchRequest.prototype.EDo = function() {
      var e, i, k, l, limit, obj, params, ref, ref1, reqs, res, split;
      try {
        if (this.useFetchAll) {
          limit = 100;
          split = Math.ceil(this.p.length / limit);
          reqs = [];
          for (i = k = 0, ref = split; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            params = createRequest.call(this, this.p.splice(0, limit));
            params.url = this.url;
            reqs.push(params);
          }
          r = UrlFetchApp.fetchAll(reqs);
          res = r.reduce(function(ar, e) {
            var obj;
            if (e.getResponseCode() !== 200) {
              ar.push(e.getContentText());
            } else {
              obj = this.exportDataAsBlob ? parserAsBinary.call(this, e) : parser.call(this, e.getContentText());
              ar = ar.concat(obj);
            }
            return ar;
          }, []);
        } else {
          limit = 100;
          split = Math.ceil(this.p.length / limit);
          res = [];
          for (i = l = 0, ref1 = split; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
            params = createRequest.call(this, this.p.splice(0, limit));
            r = UrlFetchApp.fetch(this.url, params);
            if (r.getResponseCode() !== 200) {
              res.push(r.getContentText());
            } else {
              obj = this.exportDataAsBlob ? parserAsBinary.call(this, r) : parser.call(this, r.getContentText());
              res = res.concat(obj);
            }
          }
        }
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      return res;
    };

    BatchRequest.prototype.getBatchPath = function(name, version) {
      var batchPath, discoveryRestUrl, obj1, obj2, res1, res2, url;
      version = version === void 0 ? "" : version;
      if (!name) {
        throw new Error("Please set API name you want to search.");
      }
      url = "https://www.googleapis.com/discovery/v1/apis?preferred=" + (version ? "false" : "true") + "&name=" + encodeURIComponent(name.toLowerCase());
      res1 = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true
      });
      if (res1.getResponseCode() !== 200) {
        throw new Error("Batch path cannot be found.");
      }
      obj1 = JSON.parse(res1.getContentText());
      if (!obj1.items) {
        throw new Error("Batch path cannot be found.");
      }
      discoveryRestUrl = ((version.toString() === "" ? obj1.items[0] : (obj1.items.filter(function(e) {
        return e.version === version;
      }))[0]) || {}).discoveryRestUrl;
      if (!discoveryRestUrl) {
        throw new Error("Batch path cannot be found.");
      }
      res2 = UrlFetchApp.fetch(discoveryRestUrl, {
        muteHttpExceptions: true
      });
      if (res2.getResponseCode() !== 200) {
        throw new Error("Batch path cannot be found.");
      }
      obj2 = JSON.parse(res2);
      batchPath = obj2.batchPath;
      return batchPath;
    };

    parser = function(d_) {
      var regex, temp;
      temp = d_.split("--batch");
      regex = /{[\S\s]+}/g;
      if (!d_.match(regex)) {
        return d_;
      }
      return temp.slice(1, temp.length - 1).map(function(e) {
        if (regex.test(e)) {
          return JSON.parse(e.match(regex)[0]);
        }
        return e;
      });
    };

    splitByteArrayBySearchData = function(baseData_, searchData_) {
      var bLen, idx, res, search;
      search = searchData_.join("");
      bLen = searchData_.length;
      res = [];
      idx = 0;
      while (idx !== -1) {
        idx = baseData_.findIndex(function(_, i, a) {
          return (Array(bLen).fill(null).map(function(_, j) {
            return a[j + i];
          })).join("") === search;
        });
        if (idx !== -1) {
          res.push(baseData_.splice(0, idx));
          baseData_.splice(0, bLen);
        } else {
          res.push(baseData_.splice(0));
        }
      }
      return res;
    };

    parserAsBinary = function(d_) {
      var baseData, blobs, check, res1, search, searchData;
      check = d_.getContentText().match(/--batch.*/);
      if (!check) {
        throw new Error("Valid response value is not returned.");
      }
      search = check[0];
      baseData = d_.getContent();
      searchData = Utilities.newBlob(search).getBytes();
      res1 = splitByteArrayBySearchData.call(this, baseData, searchData);
      res1.shift();
      res1.pop();
      blobs = res1.map(function(e, i) {
        var data, dataSize, metadata, rrr;
        rrr = splitByteArrayBySearchData.call(this, e, [13, 10, 13, 10]);
        data = rrr.pop();
        metadata = Utilities.newBlob(rrr.flat()).getDataAsString();
        dataSize = Number(metadata.match(/Content-Length:(.*)/)[1]);
        return Utilities.newBlob(data.splice(0, dataSize)).setName("blob" + (i + 1));
      });
      return blobs;
    };

    createRequest = function(d_) {
      var contentId, data, e, params;
      try {
        contentId = 0;
        data = "--" + this.boundary + this.lb;
        d_.forEach((function(_this) {
          return function(e) {
            data += "Content-Type: application/http" + _this.lb;
            data += "Content-ID: " + ++contentId + _this.lb + _this.lb;
            data += e.method + " " + e.endpoint + _this.lb;
            data += e.accessToken ? "Authorization: Bearer " + e.accessToken + _this.lb : "";
            data += e.requestBody ? "Content-Type: application/json; charset=utf-8" + _this.lb + _this.lb : _this.lb;
            data += e.requestBody ? JSON.stringify(e.requestBody) + _this.lb : "";
            return data += "--" + _this.boundary + _this.lb;
          };
        })(this));
        params = {
          muteHttpExceptions: true,
          method: "post",
          contentType: "multipart/mixed; boundary=" + this.boundary,
          payload: Utilities.newBlob(data).getBytes(),
          headers: {
            Authorization: 'Bearer ' + this.at
          }
        };
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      return params;
    };

    return BatchRequest;

  })();
  return r.BatchRequest = BatchRequest;
})(this);
