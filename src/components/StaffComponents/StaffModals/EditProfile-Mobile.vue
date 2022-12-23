<template>
	<v-dialog v-model="activateEditProfileMobileModal" persistent fullscreen>
		<v-card>
			<div class="con">
				<div class="headerSec">
					<h2 class="modalTitle">Edit Profile</h2>
					<v-btn
						color="#4C5B77"
						fab
						dark
						x-small
						@click="cancelEdit"
						id="closeBtn"
						><v-icon>mdi-close</v-icon></v-btn
					>
				</div>
				<div class="profileSection">
					<div class="profImageCon largeView">
						<v-avatar size="100" color="#4C5B77"
							><span style="color: white; font-size: 24px">MR</span></v-avatar
						>
					</div>

					<div class="profImageCon smallView">
						<v-avatar size="80" color="#4C5B77"
							><span style="color: white; font-size: 24px">MR</span></v-avatar
						>
					</div>

					<div class="profileDetailsCon">
						<div class="nameCon" id="userFullname">
							{{ editUser.first_name }}
							{{
								editUser.middle_name ? editUser.middle_name.split("")[0] : ""
							}}.
							{{ editUser.last_name }}
						</div>
						<div class="roleCon" id="userRole">{{ editUser.role }}</div>
					</div>
				</div>

				<div
					class="selectBtns"
					v-if="!editUsername && !editPassword && !loading"
				>
					<v-btn
						block
						color="#5A6882"
						dark
						:outlined="!editUsername"
						@click="select('editUsername')"
						dense
						id="editEmailBtn"
						>Edit Email</v-btn
					>
					<v-btn
						block
						color="#5A6882"
						dark
						:outlined="!editPassword"
						@click="select('editPassword')"
						dense
						id="changePasswordBtn"
						>Change Password</v-btn
					>
				</div>

				<div class="field" v-if="editUsername">
					<div class="fieldLabel">Username *</div>
					<div class="select">
						<v-text-field
							filled
							dense
							id="emailField"
							v-model="editUser.email"
							:rules="emailRules"
							counter="30"
						></v-text-field>
					</div>
				</div>

				<div class="loadingAnim" v-if="loading">
					<v-progress-circular
						indeterminate
						color="#596781"
						:size="50"
					></v-progress-circular>
				</div>

				<div v-if="editPassword">
					<div class="field">
						<div class="fieldLabel">Current Password *</div>
						<div class="select">
							<v-text-field
								filled
								dense
								id="currentPasswordField"
								:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
								:type="show1 ? 'text' : 'password'"
								@click:append="show1 = !show1"
								:rules="cpasswordrules"
								v-model="current_password"
								counter="30"
							></v-text-field>
						</div>
					</div>
					<div class="field">
						<div class="fieldLabel">New Password *</div>
						<div class="select">
							<v-text-field
								filled
								dense
								v-model="new_password"
								id="newPasswordField"
								:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
								:type="show2 ? 'text' : 'password'"
								@click:append="show2 = !show2"
								:rules="passwordRules"
								counter="30"
							></v-text-field>
						</div>
					</div>
				</div>

				<br />

				<div class="btnsCon" v-if="editPassword || editUsername">
					<v-btn
						text
						color="#4C5B77"
						small
						v-if="editUsername"
						@click="select('editPassword')"
						id="changePasswordInsteadBtn"
						>Change Password Instead</v-btn
					>

					<v-btn
						text
						color="#4C5B77"
						@click="select('editUsername')"
						small
						v-if="editPassword"
						id="editEmailInstead"
						>Edit Email Instead</v-btn
					>

					<v-btn
						color="#4C5B77"
						:dark="!notValidUsername"
						v-if="editUsername"
						:disabled="notValidUsername"
						@click="updateUser()"
						:loading="adminStore.loading"
						id="updateBtn"
						>Update</v-btn
					>
					<v-btn
						color="#4C5B77"
						v-if="editPassword"
						:dark="validateChangePassword"
						:disabled="!validateChangePassword"
						@click="changePassword()"
						:loading="adminStore.loading"
						id="updateBtn"
						>Update</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAdminAuthStore } from "../../../store/AdminAuth";
	export default {
		props: {
			activateEditProfileMobileModal: Boolean,
		},

		created() {
			this.user = this.adminStore.user;
			this.editUser = Object.assign({}, this.user);
		},
		data() {
			return {
				adminStore: useAdminAuthStore(),
				show1: false,
				show2: false,
				editUser: null,
				editUsername: false,
				editPassword: false,
				cpasswordrules: [
					(v) => !!v || "Required",
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				emailRules: [
					(v) => !!v.trim() || "This field is required",
					(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email must be valid",
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				current_password: "",
				new_password: "",
				snackbar: false,
				status: null,
				message: "",
				loading: false,
			};
		},

		methods: {
			cancelEdit() {
				this.$emit("cancelEdit");
			},

			select(params) {
				if (params == "editUsername") {
					this.editUsername = false;
					this.editPassword = false;
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						this.editUser = Object.assign({}, this.user);
						this.editUsername = true;
					}, 1000);
				}

				if (params == "editPassword") {
					this.editUsername = false;
					this.editPassword = false;
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						this.current_password = "";
						this.new_password = "";
						this.editPassword = true;
					}, 1000);
				}
			},

			updateUser() {
				this.$emit("updateProfile", this.editUser.email);
			},

			changePassword() {
				this.$emit("changeProfilePassword", {
					currentPasssword: this.current_password,
					newPassword: this.new_password,
				});
			},
		},

		computed: {
			notValidUsername: function () {
				return (
					this.editUser.email == this.user.email ||
					this.editUser.email.length == 0 ||
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editUser.email)
				);
			},

			validateChangePassword: function () {
				if (
					this.current_password != "" &&
					this.current_password.length <= 30 &&
					this.passwordRules[0] == true
				) {
					return true;
				}

				return false;
			},

			passwordRules: function () {
				if (this.new_password == "") {
					return ["Required"];
				}

				if (this.new_password.length > 30) {
					return ["Exceeded number of characters"];
				}

				if (this.new_password.length < 8) {
					return ["Minimum of 8 characters"];
				}

				if (!/^(?=.*?[a-z])/.test(this.new_password)) {
					return ["Password must have lowercase letter."];
				}

				if (!/^(?=.*?[A-Z])/.test(this.new_password)) {
					return ["Password must have uppercase letter."];
				}

				if (!/^(?=.*?[0-9])/.test(this.new_password)) {
					return ["Password must have a number."];
				}

				if (!/^(?=.*?[#?!@$%^&*-])/.test(this.new_password)) {
					return ["Password must have a character."];
				}

				return [true];
			},
		},
	};
</script>

<style scoped>
	.con {
		padding: 40px;
		color: #4b5a76;
	}

	.modalTitle {
		font-weight: 500;
	}

	.profileSection {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20px 0px;
		color: #4c5b77;
	}

	.profileSection div {
		margin: 0px 5px;
	}

	.nameCon {
		font-size: 22px;
		font-weight: 500;
	}

	.roleCon {
		font-size: 16px;
	}

	.smallView {
		display: none;
	}

	.field {
		padding: 0px 20px;
		margin-bottom: -5px;
	}

	.fieldLabel {
		font-weight: 500;
	}

	.btnsCon {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.headerSec {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.selectBtns .v-btn {
		margin: 10px 0px;
	}

	.loadingAnim {
		margin: 100px auto;
		text-align: center;
	}

	@media only screen and (max-width: 1250px) {
		.profileSection div {
			margin: 0px 5px;
		}

		.nameCon {
			font-size: 18px;
			font-weight: 500;
		}

		.roleCon {
			font-size: 12px;
		}
	}

	@media only screen and (max-width: 1020px) {
		.profileSection {
			margin-bottom: 20px;
		}
	}

	@media only screen and (max-width: 650px) {
		.profileSection {
			padding: 20px 0px;
		}
		.smallView {
			margin-top: 10px;
			margin-bottom: -20px;
			display: block;
		}

		.largeView {
			display: none;
		}

		.fieldLabel {
			font-size: 12px;
		}

		.con {
			padding: 20px;
		}

		.field {
			padding: 0px 10px;
		}

		.btnsCon .v-btn {
			height: 30px;
			font-size: 12px;
			padding: 0px 5px;
		}
	}
</style>
