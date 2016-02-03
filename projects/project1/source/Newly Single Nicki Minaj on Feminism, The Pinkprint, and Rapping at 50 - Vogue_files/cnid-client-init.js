/* This is a generated file, do not edit directly */
            var user = {
                    authToken: '',
                    expires: (365 * 300)
                },
                cnBrand = cnBrand || {
                    regPath: {
                        auth: 'authvog',
                        commenting: 'commentingvog'
                    },

                    getUserToken: function () {
                        jQuery.ajax({
                            type: 'GET',
                            success: function (response, status, jqXHR) {
                                var livefyre = response,
                                    setCookieObj = {
                                        encode: false,
                                        path: '/',
                                        expires: 365 * 300,
                                        domain: '.' + CN.site.domain
                                    };

                                if (livefyre !== null) {
                                    user.userToken = livefyre;
                                    CN.cookie.set('lt', user.userToken, setCookieObj );
                                    jQuery(window).trigger( '$event:userLoggedInToLF' );
                                }
                            },
                            url: CN.site.socialRes + '?detailId=' + user.siteUserId + '&displayName=' + user.username + '&siteCode=' + CN.site.code
                        });
                    },

                    getAuthSummary: function () {
                        jQuery.ajax({
                            type: 'POST',
                            url: 'https://cnid.condenastdigital.com/service/authSummary',
                            data: {
                                apiKey: '77eaa713-2487-4629-a280-bbaa32c513c4',
                                authToken: user.authToken,
                                siteCode: CN.site.code
                            },
                            success: function (response, status, jqXHR) {
                                var amg = response.amg,
                                    setCookieObj = {
                                        encode: false,
                                        path: '/',
                                        expires: 365 * 300,
                                        domain: '.' + CN.site.domain
                                    };

                                if (amg !== null) {
                                    jQuery.extend( user, amg );
                                    CN.cookie.set( user.amgCookieName, user.amgCookieValue, setCookieObj );
                                    CN.cookie.set( 'amg_user_partner', user.amgUUID, setCookieObj);
                                    CN.cookie.set( 'amg_user_record', 'username=' + user.username + '|email=' + user.email + '|conf=false|fs=false|uid=true', setCookieObj);

                                    cnBrand.getUserToken();

                                    jQuery('#cnid-modal').modal('hide');
                                }
                            }
                        });
                    },

                    postMessageCallback: function(data) { //  called every time cnid tries to communicate to brand client
                        //console.log('%cpostMessageCallback callback fires on the brand client', 'color:green');
                        //console.log(data);

                        //  callback that'll recieve data (authToken, showLoader, scrollTop, etc.) from CNID

                        //  scroll to top
                        if ( data.scrollTop ) {
                            jQuery("#frameContainer").animate({
                                scrollTop: 0 // scroll to top
                            }, 1);
                        }

                        //  show loader
                        if ( data.showLoader ) {
                            jQuery('#loader-container').show();
                        } else {
                            jQuery('#loader-container').hide();
                        }

                        if ( data.authToken ) {
                            user.authToken = data.authToken;
                            user.expires = (data.rememberMe) ? (365 * 300) : null;
                            cnBrand.getAuthSummary();

                            if ( typeof( update_login_status ) != undefined ) {
                                update_login_status();
                            }
                        }

                        if ( data.alert ) {
                            jQuery('#alert-txt').html(data.alert.message);
                            jQuery('#alert-message')[((data.alert.type === 'error') ? 'add' : 'remove') + 'Class']('alert-error');
                            jQuery('#alerts-container').show();
                        }
                    },

                    hostEnv: function() {
                        //  determine brand environment and return a String ('prod', 'stag', 'dev', 'local')
                    return "prod"                    },

                    logout: function(){
                        jQuery.ajax({
                            type: 'GET',
                            success: function (response, status, jqXHR) {
                                //console.log('logout success');
                                cnBrand.clearCookies();
                            },
                            url: "/services/logged-out"
                        });
                    },

                    clearCookies: function( ) {
                        //console.log('clear cookies');

                        var deleteCookieObj = {
                                encode: false,
                                path: '/',
                                expires: -1,
                                domain: '.' + CN.site.domain
                            };

                        CN.cookie.del( 'lt', deleteCookieObj );
                        CN.cookie.del( 'amg_user', deleteCookieObj );
                        CN.cookie.del( 'at', deleteCookieObj );
                        CN.cookie.del( 'amg_user_record', deleteCookieObj );
                        CN.cookie.del( 'amg_user_identity', deleteCookieObj );
                        CN.cookie.del( 'amg_user_partner', deleteCookieObj );
                        CN.cookie.del( 'toolkit_reg', deleteCookieObj );

                        CN.cookie.del( 'PHPSESSID', {
                            path: '/',
                            domain: ''
                        } );

                        CN.cookie.delCache();
                    },

                    initializeCNID: function( regPath, regSrc ) {
                        if ( regSrc == undefined ) {
                            if ( regPath === cnBrand.regPath.commenting ) {
                                regSrc = 'CNID_VOG_COMMENTING';
                            } else {
                                regSrc = 'CNID_VOG_REG';
                            }
                        }
                        CNID.init({
                            iframeId: 'cnidClient',                                             //  required, id of iframe
                            brand: 'com.condenet.vogue',    //  required, brand name
                            regPath: regPath,                                                   //  required, path to configure
                            regSrc: regSrc,                                                     //  required, registration source
                            postMessageCallback: this.postMessageCallback,                      //  required, callback method that'll receive postMessage data
                            hostEnv: this.hostEnv                                               //  optional, function callback that determines brand environment
                        });

                        jQuery('#cnid-modal').modal();
                    }
                }

                jQuery('#cnid-modal').on('hide', function(e) {
                    if (e.type === 'hide') {
                        //console.log('%cPOSTMESSAGING to CNID...', 'color:red');
                        CNID.postMessage({
                            hideModal: true
                        });
                    }
                });

                jQuery('.cn-login').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    cnBrand.initializeCNID( cnBrand.regPath.auth, 'CNID_VOG_REG' );
                });

                jQuery('.cn-register').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    cnBrand.initializeCNID( cnBrand.regPath.auth, 'CNID_VOG_REG' );
                });

                jQuery('.cn-forgotpassword').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    cnBrand.initializeCNID( cnBrand.regPath.auth, 'CNID_VOG_REG' );
                });

                jQuery('.cn-profile').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location = "https://www.vogue.com/user/update?returnto=" + document.location.href;
                });

                jQuery('.cn-logout').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    cnBrand.logout();
                });
            