provider "netlify" {
  token = "${var.netlify_token}"
}

provider "cloudflare" {
  email = "${var.cloudflare_email}"
  token = "${var.cloudflare_token}"
}
