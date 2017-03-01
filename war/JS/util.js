$(function() {
    var metrics = [
     "ga:visitors",
"ga:newVisits",
"ga:percentNewVisits",
"ga:visits",
"ga:bounces",
"ga:entranceBounceRate",
"ga:visitBounceRate",
"ga:timeOnSite",
"ga:avgTimeOnSite",
"ga:organicSearches",
"ga:impressions",
"ga:adClicks",
"ga:adCost",
"ga:CPM",
"ga:CPC",
"ga:CTR",
"ga:costPerTransaction",
"ga:costPerGoalConversion",
"ga:costPerConversion",
"ga:RPC",
"ga:ROI",
"ga:margin",
"ga:goalXXStarts",
"ga:goalStartsAll",
"ga:goalXXCompletions",
"ga:goalCompletionsAll",
"ga:goalXXValue",
"ga:goalValueAll",
"ga:goalValuePerVisit",
"ga:goalXXConversionRate",
"ga:goalConversionRateAll",
"ga:goalXXAbandons",
"ga:goalAbandonsAll",
"ga:goalXXAbandonRate",
"ga:goalAbandonRateAll",
"ga:socialActivities",
"ga:pageValue",
"ga:entrances",
"ga:entranceRate",
"ga:pageviews",
"ga:pageviewsPerVisit",
"ga:uniquePageviews",
"ga:timeOnPage",
"ga:avgTimeOnPage",
"ga:exits",
"ga:exitRate",
"ga:searchResultViews",
"ga:searchUniques",
"ga:avgSearchResultViews",
"ga:searchVisits",
"ga:percentVisitsWithSearch",
"ga:searchDepth",
"ga:avgSearchDepth",
"ga:searchRefinements",
"ga:percentSearchRefinements",
"ga:searchDuration",
"ga:avgSearchDuration",
"ga:searchExits",
"ga:searchExitRate",
"ga:searchGoalXXConversionRate",
"ga:searchGoalConversionRateAll",
"ga:goalValueAllPerSearch",
"ga:pageLoadTime",
"ga:pageLoadSample",
"ga:avgPageLoadTime",
"ga:domainLookupTime",
"ga:avgDomainLookupTime",
"ga:pageDownloadTime",
"ga:avgPageDownloadTime",
"ga:redirectionTime",
"ga:avgRedirectionTime",
"ga:serverConnectionTime",
"ga:avgServerConnectionTime",
"ga:serverResponseTime",
"ga:avgServerResponseTime",
"ga:speedMetricsSample",
"ga:domInteractiveTime",
"ga:avgDomInteractiveTime",
"ga:domContentLoadedTime",
"ga:avgDomContentLoadedTime",
"ga:domLatencyMetricsSample",
"ga:screenviews",
"ga:appviews",
"ga:uniqueScreenviews",
"ga:uniqueAppviews",
"ga:screenviewsPerSession",
"ga:appviewsPerVisit",
"ga:timeOnScreen",
"ga:avgScreenviewDuration",
"ga:totalEvents",
"ga:uniqueEvents",
"ga:eventValue",
"ga:avgEventValue",
"ga:visitsWithEvent",
"ga:eventsPerVisitWithEvent",
"ga:transactions",
"ga:transactionsPerVisit",
"ga:transactionRevenue",
"ga:revenuePerTransaction",
"ga:transactionRevenuePerVisit",
"ga:transactionShipping",
"ga:transactionTax",
"ga:totalValue",
"ga:itemQuantity",
"ga:uniquePurchases",
"ga:revenuePerItem",
"ga:itemRevenue",
"ga:itemsPerPurchase",
"ga:localTransactionRevenue",
"ga:localTransactionShipping",
"ga:localTransactionTax",
"ga:localItemRevenue",
"ga:socialInteractions",
"ga:uniqueSocialInteractions",
"ga:socialInteractionsPerVisit",
"ga:userTimingValue",
"ga:userTimingSample",
"ga:avgUserTimingValue",
"ga:exceptions",
"ga:exceptionsPerScreenview",
"ga:fatalExceptions",
"ga:fatalExceptionsPerScreenview",
"ga:metricXX",
"ga:adsenseRevenue",
"ga:adsenseAdUnitsViewed",
"ga:adsenseAdsViewed",
"ga:adsenseAdsClicks",
"ga:adsensePageImpressions",
"ga:adsenseCTR",
"ga:adsenseECPM",
"ga:adsenseExits",
  
    ];
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
 
    $( "#metric_value" )
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).data( "ui-autocomplete" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            metrics, extractLast( request.term ) ) );
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join( "," );
          return false;
        }
      });
  });

//dimension auto complete

$(function() {
    var metrics = [
     "ga:visitorType",
"ga:visitCount",
"ga:daysSinceLastVisit",
"ga:userDefinedValue",
"ga:visitLength",
"ga:referralPath",
"ga:fullReferrer",
"ga:campaign",
"ga:source",
"ga:medium",
"ga:sourceMedium",
"ga:keyword",
"ga:adContent",
"ga:socialNetwork",
"ga:hasSocialSourceReferral",
"ga:adGroup",
"ga:adSlot",
"ga:adSlotPosition",
"ga:adDistributionNetwork",
"ga:adMatchType",
"ga:adKeywordMatchType",
"ga:adMatchedQuery",
"ga:adPlacementDomain",
"ga:adPlacementUrl",
"ga:adFormat",
"ga:adTargetingType",
"ga:adTargetingOption",
"ga:adDisplayUrl",
"ga:adDestinationUrl",
"ga:adwordsCustomerID",
"ga:adwordsCampaignID",
"ga:adwordsAdGroupID",
"ga:adwordsCreativeID",
"ga:adwordsCriteriaID",
"ga:goalCompletionLocation",
"ga:goalPreviousStep1",
"ga:goalPreviousStep2",
"ga:goalPreviousStep3",
"ga:browser",
"ga:browserVersion",
"ga:operatingSystem",
"ga:operatingSystemVersion",
"ga:isMobile",
"ga:isTablet",
"ga:mobileDeviceBranding",
"ga:mobileDeviceModel",
"ga:mobileInputSelector",
"ga:mobileDeviceInfo",
"ga:mobileDeviceMarketingName",
"ga:deviceCategory",
"ga:continent",
"ga:subContinent",
"ga:country",
"ga:region",
"ga:metro",
"ga:city",
"ga:latitude",
"ga:longitude",
"ga:networkDomain",
"ga:networkLocation",
"ga:flashVersion",
"ga:javaEnabled",
"ga:language",
"ga:screenColors",
"ga:screenResolution",
"ga:socialActivityEndorsingUrl",
"ga:socialActivityDisplayName",
"ga:socialActivityPost",
"ga:socialActivityTimestamp",
"ga:socialActivityUserHandle",
"ga:socialActivityUserPhotoUrl",
"ga:socialActivityUserProfileUrl",
"ga:socialActivityContentUrl",
"ga:socialActivityTagsSummary",
"ga:socialActivityAction",
"ga:socialActivityNetworkAction",
"ga:hostname",
"ga:pagePath",
"ga:pagePathLevel1",
"ga:pagePathLevel2",
"ga:pagePathLevel3",
"ga:pagePathLevel4",
"ga:pageTitle",
"ga:landingPagePath",
"ga:secondPagePath",
"ga:exitPagePath",
"ga:previousPagePath",
"ga:nextPagePath",
"ga:pageDepth",
"ga:searchUsed",
"ga:searchKeyword",
"ga:searchKeywordRefinement",
"ga:searchCategory",
"ga:searchStartPage",
"ga:searchDestinationPage",
"ga:appInstallerId",
"ga:appVersion",
"ga:appName",
"ga:appId",
"ga:screenName",
"ga:screenDepth",
"ga:landingScreenName",
"ga:exitScreenName",
"ga:eventCategory",
"ga:eventAction",
"ga:eventLabel",
"ga:transactionId",
"ga:affiliation",
"ga:visitsToTransaction",
"ga:daysToTransaction",
"ga:productSku",
"ga:productName",
"ga:productCategory",
"ga:currencyCode",
"ga:socialInteractionNetwork",
"ga:socialInteractionAction",
"ga:socialInteractionNetworkAction",
"ga:socialInteractionTarget",
"ga:socialEngagementType",
"ga:userTimingCategory",
"ga:userTimingLabel",
"ga:userTimingVariable",
"ga:exceptionDescription",
"ga:experimentId",
"ga:experimentVariant",
"ga:dimensionXX",
"ga:customVarNameXX",
"ga:customVarValueXX",
"ga:date",
"ga:year",
"ga:month",
"ga:week",
"ga:day",
"ga:hour",
"ga:minute",
"ga:nthMonth",
"ga:nthWeek",
  
    ];
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
 
    $( "#dimension_val" )
      // don't navigate away from the field on tab when selecting an item
      .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).data( "ui-autocomplete" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            metrics, extractLast( request.term ) ) );
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end      
          terms.push( "" );
          this.value = terms.join( "," );
          return false;
        }
      });
  });

