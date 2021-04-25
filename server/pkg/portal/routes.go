package portal

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
	"qxp-web/server/pkg/portal/handlers"

	"github.com/gorilla/mux"
)

func loginRequired(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !handlers.IsUserLogin(r) {
			handlers.RedirectToLoginPage(w, r)
			return
		}

		r = handlers.DecoratRequest(r)

		h(w, r)
	}
}

func tokenRequired(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !handlers.IsUserLogin(r) && r.URL.Path != "/api/v1/org/login/code" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		h(w, r)
	}
}

// GetRouter return mux router
func GetRouter() http.Handler {
	r := mux.NewRouter()

	r.Headers("X-Proxy", "API").HandlerFunc(tokenRequired(handlers.ProxyAPIHandler))
	r.Headers("X-Proxy", "API-NO-AUTH").HandlerFunc(handlers.ProxyAPIHandler)

	r.Path("/_otp").Methods("GET").HandlerFunc(tokenRequired((handlers.OTPHandler)))

	r.Path("/login/{type}").Methods("GET").HandlerFunc(handlers.HandleLogin)
	r.Path("/login/{type}").Methods("POST").HandlerFunc(handlers.HandleLoginSubmit)
	r.Path("/logout").Methods("POST").HandlerFunc(handlers.LogoutHandler)
	r.Path("/resetPassword").Methods("GET").HandlerFunc(loginRequired(handlers.HandleResetPassword))
	r.Path("/resetPassword").Methods("POST").HandlerFunc(handlers.HandleResetPasswordSubmit)
	r.Path("/retrievePassword").Methods("GET").HandlerFunc(handlers.HandleRetrievePassword)
	r.Path("/retrievePassword").Methods("POST").HandlerFunc(handlers.HandleRetrievePasswordSubmit)
	r.PathPrefix("/apps").Methods("GET").HandlerFunc(handlers.AppManagerHandler)

	r.PathPrefix("/").Methods("GET").HandlerFunc(loginRequired(handlers.PortalHandler))

	return contexts.RequestIDMiddleware(r)
}
