export function getUtmParams(): Record<string, string> {
  const utmSource =
    getParameterByName("utm_source") ??
    getCookieValue("cookieUtmSource") ??
    (document.referrer
      ? new URLSearchParams(document.referrer.split("?")[1] || "").get("utm_source") ??
        new URL(document.referrer).hostname
      : "direto");

  const utmMedium =
    getParameterByName("utm_medium") ?? getCookieValue("cookieUtmMedium") ?? "";

  const utmCampaign =
    getParameterByName("utm_campaign") ?? getCookieValue("cookieUtmCampaign") ?? "";

  const utmContent =
    getParameterByName("utm_content") ?? getCookieValue("cookieUtmContent") ?? "";

  const utmTerm =
    getParameterByName("utm_term") ?? getCookieValue("cookieUtmTerm") ?? "";

  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
  };
}

function getParameterByName(name: string, url?: string) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCookieValue(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return null;
}
