import { defineStore } from "pinia";
import StaffAPI from "../api/StaffAPI";
export const useAdminAuthStore = defineStore("adminAuth", {
	state: () => ({
		fetched: false,
		loading: false,
		error: null,
		accessdenied: false,
		user: null,
	}),
	getters: {
		getUser() {
			return this.user;
		},
	},
	actions: {
		async logIn(user) {
			try {
				this.loading = true;
				const result = await StaffAPI.prototype.login(user);
				localStorage.setItem("token", JSON.stringify(result.data.access_token));
				this.loading = false;
				this.error = null;
				return true;
			} catch (error) {
				this.error = error;
				this.loading = false;
			}
		},

		async checkIfAuthenticated() {
			try {
				this.loading = true;
				this.fetched = false;
				const result = await StaffAPI.prototype.getUserData();
				this.user = result.data.user;
				if (this.user.role == "admin" || this.user.role == "staff") {
					this.fetched = true;
					this.loading = false;
				} else {
					this.loading = false;
					this.accessdenied = true;
					this.fetched = false;
				}
				this.error = null;
			} catch (error) {
				this.error = error;
				this.loading = false;
				this.fetched = false;
			}
		},

		async updateUserEmail(email) {
			try {
				this.loading = true;
				const updated = Object.assign({}, this.user);
				updated.email = email;
				await StaffAPI.prototype.updatePersonalDetails(updated);
				this.user.email = email;
				this.loading = false;
				this.error = null;
			} catch (error) {
				this.error = error;
				this.loading = false;
			}
		},

		async updateUserPassword(updated) {
			try {
				this.loading = true;

				const payload = {
					current_password: updated.currentPasssword,
					new_password: updated.newPassword,
				};

				await StaffAPI.prototype.changePassword(payload, this.user.uuid);

				this.loading = false;
				this.error = null;
			} catch (error) {
				this.error = error;
				this.loading = false;
			}
		},
	},
});
