resource "netlify_site" "deb-ug" {
  name = "deb.ug"

  custom_domain = "deb.ug"

  repo {
    repo_branch = "main"
    command     = "npm run build"
    dir         = "public"
    provider    = "github"
    repo_path   = "Brian-Gaffney/Deb.ug"
  }
}
