"use client";

import { useEffect } from "react";

export default function UtmTracker() {
  useEffect(() => {
    console.log(
      "%cScript de rastreio 4.0 by Comunidade Nova Ordem do Digital - Dericson Calari e Samuel Choairy",
      "color: yellow; font-size: 20px;"
    );

    function getParameterByName(name: string, url?: string) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function setCookie(cookieName: string, cookieValue: string, expirationTime: number) {
      const cookiePath = "/";
      expirationTime = expirationTime * 1000;
      const date = new Date();
      const dateTimeNow = date.getTime();
      date.setTime(dateTimeNow + expirationTime);
      const expirationDate = date.toUTCString();
      document.cookie =
        cookieName + "=" + cookieValue + "; expires=" + expirationDate + "; path=" + cookiePath;
    }

    function getCookieValue(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(";").shift()!;
      return null;
    }

    const adParams = ["fbclid", "gclid"];

    const urlParams = new URLSearchParams(window.location.search);
    let isAdClick = false;
    adParams.forEach((param) => {
      if (urlParams.has(param)) {
        isAdClick = true;
      }
    });

    if (isAdClick) {
      const utmSource = getParameterByName("utm_source");
      const utmMedium = getParameterByName("utm_medium");
      const utmCampaign = getParameterByName("utm_campaign");
      const utmContent = getParameterByName("utm_content");
      const utmTerm = getParameterByName("utm_term");

      if (utmSource) setCookie("cookieUtmSource", utmSource, 63072000);
      if (utmMedium) setCookie("cookieUtmMedium", utmMedium, 63072000);
      if (utmCampaign) setCookie("cookieUtmCampaign", utmCampaign, 63072000);
      if (utmContent) setCookie("cookieUtmContent", utmContent, 63072000);
      if (utmTerm) setCookie("cookieUtmTerm", utmTerm, 63072000);
    }

    const parametros = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const urlParamsCapt = new URLSearchParams(window.location.search);
    const urlParamsCaptReferrer = new URLSearchParams(
      document.referrer.split("?")[1] || ""
    );
    const utms: Record<string, string> = {};

    const cookieUtmSource = getCookieValue("cookieUtmSource");
    const cookieUtmMedium = getCookieValue("cookieUtmMedium");
    const cookieUtmCampaign = getCookieValue("cookieUtmCampaign");
    const cookieUtmContent = getCookieValue("cookieUtmContent");
    const cookieUtmTerm = getCookieValue("cookieUtmTerm");

    parametros.forEach((el) => {
      if (el === "utm_source") {
        utms[el] =
          urlParamsCapt.get(el) ??
          (document.referrer
            ? urlParamsCaptReferrer.get(el) ?? new URL(document.referrer).hostname
            : "direto");
      } else {
        utms[el] = urlParamsCapt.get(el) ?? (urlParamsCaptReferrer.get(el) ?? "");
      }
    });

    let scks = Object.values(utms).filter((value) => value !== "");

    const currentSckValues: string[] = [];
    if (urlParamsCapt.get("sck")) {
      currentSckValues.push(...urlParamsCapt.get("sck")!.split("|"));
    }
    scks = scks.filter((value) => !currentSckValues.includes(value));

    const srcValues = [
      cookieUtmSource,
      cookieUtmMedium,
      cookieUtmCampaign,
      cookieUtmContent,
      cookieUtmTerm,
    ].filter((value) => value !== null && value !== "");

    const updateLinks = (el: HTMLAnchorElement, elURL: URL) => {
      const elSearchParams = new URLSearchParams(elURL.search);
      let modified = false;

      urlParams.forEach((value, key) => {
        if (!elSearchParams.has(key)) {
          elSearchParams.append(key, value);
          modified = true;
        }
      });

      for (const key in utms) {
        if (!elSearchParams.has(key)) {
          elSearchParams.append(key, utms[key]);
          modified = true;
        }
      }

      if (cookieUtmSource) elSearchParams.append("cookieUtmSource", cookieUtmSource);
      if (cookieUtmMedium) elSearchParams.append("cookieUtmMedium", cookieUtmMedium);
      if (cookieUtmCampaign) elSearchParams.append("cookieUtmCampaign", cookieUtmCampaign);
      if (cookieUtmContent) elSearchParams.append("cookieUtmContent", cookieUtmContent);
      if (cookieUtmTerm) elSearchParams.append("cookieUtmTerm", cookieUtmTerm);

      if (!elSearchParams.has("sck") && scks.length > 0) {
        elSearchParams.append("sck", scks.join("|"));
        modified = true;
      }

      if (!elSearchParams.has("src") && srcValues.length > 0) {
        elSearchParams.append("src", srcValues.join("|"));
        modified = true;
      }

      if (modified) {
        return elURL.origin + elURL.pathname + "?" + elSearchParams.toString();
      }
      return el.href;
    };

    function processAllLinks() {
      document.querySelectorAll<HTMLAnchorElement>("a").forEach((el) => {
        try {
          const elURL = new URL(el.href, window.location.origin);
          if (!elURL.hash) {
            el.href = updateLinks(el, elURL);
          }
        } catch (e) {
          console.warn("Erro ao processar URL no link:", el.href);
        }
      });
    }

    processAllLinks();

    const observer = new MutationObserver(() => {
      processAllLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
