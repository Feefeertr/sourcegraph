package githuboauth

import (
	"net/http"

	"github.com/sourcegraph/sourcegraph/cmd/frontend/external/auth"
	"github.com/sourcegraph/sourcegraph/enterprise/cmd/frontend/auth/oauth"
	"github.com/sourcegraph/sourcegraph/pkg/extsvc/github"
	"github.com/sourcegraph/sourcegraph/schema"
)

const authPrefix = auth.AuthURLPrefix + "/github"

func init() {
	oauth.AddIsOAuth(func(p schema.AuthProviders) bool {
		return p.Github != nil
	})
}

var Middleware = &auth.Middleware{
	API: func(next http.Handler) http.Handler {
		return ffHandler(oauth.NewHandler(github.ServiceType, authPrefix, true, next), next)
	},
	App: func(next http.Handler) http.Handler {
		return ffHandler(oauth.NewHandler(github.ServiceType, authPrefix, false, next), next)
	},
}

func ffHandler(ffEnabled, ffDisabled http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if ffIsEnabled {
			ffEnabled.ServeHTTP(w, r)
		} else {
			ffDisabled.ServeHTTP(w, r)
		}
	})
}
