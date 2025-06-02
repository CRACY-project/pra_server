export const MountGsiScript = (wrapperElement: HTMLElement) => {
    const metaElement = document.head.querySelector('meta[property=csp-nonce]');
    let nonce = '';
    if (metaElement) {
        const pageNonce = metaElement.getAttribute('content');
        if (pageNonce) {
            nonce = pageNonce;
        }
    }
    const src = 'https://accounts.google.com/gsi/client';

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('nonce', nonce);
    wrapperElement.appendChild(script);
};
