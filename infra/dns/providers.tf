# arc4ne.io zone records. Auth: CLOUDFLARE_API_TOKEN env (source ~/.config/claude-secrets/cloudflare.env
# and export CLOUDFLARE_API_TOKEN=$CF_API_TOKEN). State: R2, same bucket as the gipc cloudflare state.
terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "gipc-tfstate"
    key    = "arc4ne/dns.tfstate"
    region = "auto"
    endpoints = {
      s3 = "https://f9e7142c4161a8bdd7b059f188e307a8.r2.cloudflarestorage.com"
    }
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
    use_lockfile                = true
  }
}

provider "cloudflare" {}
