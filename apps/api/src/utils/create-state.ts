/**
 * Creates a random state string.
 *
 * @return {string} - State string.
 */
export function createState(): string {
    return (Math.random() + 1).toString(36).substring(7);
}
