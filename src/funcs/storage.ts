export const storage = {
	get<T>(key: string): T | null {
		if (typeof window === 'undefined') return null;

		try {
			const raw = localStorage.getItem(key);
			if (!raw) return null;

			return JSON.parse(raw) as T;
		} catch (error) {
			console.error(`[storage.get] ${key}`, error);
			return null;
		}
	},

	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined') return;

		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`[storage.set] ${key}`, error);
		}
	},

	remove(key: string): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(key);
	},
};
