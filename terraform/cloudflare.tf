resource "cloudflare_record" "netlify-cname" {
  domain = "deb.ug"
  name   = "deb.ug"
  value  = "deb-ug.netlify.com"
  type   = "CNAME"
  ttl    = 3600
}

resource "cloudflare_record" "netlify-cname-www" {
  domain = "deb.ug"
  name   = "www.deb.ug"
  value  = "deb-ug.netlify.com"
  type   = "CNAME"
  ttl    = 3600
}
