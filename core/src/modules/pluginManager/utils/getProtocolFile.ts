export const getProtocolFile = async (
    url: string,
): Promise<{
    protocol: string;
    path: string;
}> => {
    const [protocol, path] = url.split('://');

    if (!protocol || !path) {
        throw new Error('Invalid URL');
    }

    return { protocol, path };
};
