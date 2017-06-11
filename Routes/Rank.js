var similarity = require( 'compute-cosine-similarity' );


var Rank = {
   normalRanges: {
      wakeTime: {
         min: 0,
         max: 24
      },
      sleepTime: {
         min: 0,
         max: 24
      },
      cleanliness: {
         min: 0,
         max: 5
      },
      gradesRatio: {
         min: 0,
         max: 100
      }
   },
   props: ["dormName", "major", "gradesRatio", "quiet", "greekLife",
           "smoking", "drinking", "wakeTime", "sleepTime", "cleanliness"],
   categoricals: ["major", "dormName"]
}

Rank.extractFeatures = function(obj, features) {
   var result = {};
   Object.keys(obj).forEach(function (key) {
      if (features.indexOf(key) >= 0) {
         result[key] = obj[key];
      }
   });
   return result
}

Rank.oneHotEncode = function(x, y, categoricals) {
   categoricals.forEach(function (ctg) {
      if (x[ctg] && y[ctg]) {
         if (x[ctg] !== y[ctg]) {
            x[ctg] = 1;
            y[ctg] = 0;
         }
         else {
            x[ctg] = y[ctg] = 0
         }
      }
   });
}

Rank.normalize = function(x, ranges) {
   Object.keys(ranges).forEach(function(key) {
      if (x[key]) {
         var max = ranges[key].max;
         var min = ranges[key].min;
         var norm = (x[key] - min)/(max - min)
         x[key] = norm
      }
   });
}

Rank.rank = function (prefA, prefB) {
   console.log("original:")
   console.log(prefA);
   console.log(prefB);
   var featuresA = Rank.extractFeatures(prefA, Rank.props);
   var featuresB = Rank.extractFeatures(prefB, Rank.props);

   console.log(Rank.normalRanges);
   console.log("featureA:");
   console.log(featuresA);
   Rank.oneHotEncode(featuresA, featuresB, Rank.categoricals);
   Rank.normalize(featuresA, Rank.normalRanges);
   Rank.normalize(featuresB, Rank.normalRanges);
   console.log("normalized");
   console.log(featuresA);
   console.log(featuresB);

   var aX = Object.keys(featuresA).map(function(key) {
      return featuresA[key];
   });
   var bX = Object.keys(featuresB).map(function(key) {
      return featuresB[key];
   });
   console.log("similarity score:");
   console.log(aX);
   console.log(bX);
   console.log(similarity(aX, bX));
   return similarity(aX, bX);
}

Rank.rankBatch = function(pref, batchPref, aggregate) {
   var aggregation = []
   batchPref.forEach(function (otherPref) {
      var score = Rank.rank(pref, otherPref);
      aggregate(aggregation, pref, otherPref, score);
   });
   return aggregation;
}

module.exports = Rank;
