export const apiBaseUrl = "https://zimam-nsk-app.zimam.sa/api/";

export const httpToken =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzE2Nzc2MzAxLCJleHAiOjIxODMzMzYzMDEsIm5iZiI6MTcxNjc3NjMwMSwianRpIjoid0ZmdzhSZlE1VHFTNHJLQSIsInN1YiI6MjIzMzUsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.3RKMf1UlQSvm67KWakfBaNk5Bazl2FMUyCPFouOfvcM";
export const httpMobilityToken =
  "eyJhbGciOiJIUzI1NiIsEnR5cCI6IkpXVSMK.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF2ZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export const MapConfigs = {
  mapToken: "AIzaSyBiIZU1os5EBNiv4VO5N44q0xJ8XSfgW3I", // google map
  // mapToken: 'AIzaSyDKnkmWqMMKTW2OPDRwFi892uowm2uPF3w', // google map
  // mapToken: 'pk.eyJ1IjoiemltYW0iLCJhIjoiY2x3Y3BqYWQ3MDc0ZTJtbzlucjdiOHFrbSJ9.EXM_EFa6ifRdU0QukHESxg', // mapbox token
  // mapId: 'd6f14a75929ae696',
  mapId: undefined,
  mapTypeId: undefined,
  mapStyles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: 36
        },
        {
          color: "#000000"
        },
        {
          lightness: 50
        }
      ]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on"
        },
        {
          color: "#000000"
        },
        {
          lightness: 16
        }
      ]
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 20
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 17
        },
        {
          weight: 1.2
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "simplified"
        }
      ]
    },
    {
      featureType: "administrative.province",
      elementType: "all",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "administrative.locality",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified"
        },
        {
          saturation: "-100"
        },
        {
          lightness: "30"
        }
      ]
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "all",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "all",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified"
        },
        {
          gamma: "0.00"
        },
        {
          lightness: "74"
        }
      ]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 12 // 20
        }
      ]
    },
    {
      featureType: "landscape.man_made",
      elementType: "all",
      stylers: [
        {
          lightness: "3"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 21
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 25
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#ffffff"
        },
        {
          lightness: 29
        },
        {
          weight: 0.8
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 18
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 20 // 16
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 19
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        },
        {
          lightness: 17
        }
      ]
    }
  ]
};

export const ENUMS = {
  APP_LOGIN_TOKEN: "tafweej_login_token",
  APP_VERIFICATION_TOKEN: "tafweej_verification_token",
  APP_USER_INFO: "tafweej_user_info",
  OTP_RESEND_DURATION: "tafweej_otp_resend_duration"
};
