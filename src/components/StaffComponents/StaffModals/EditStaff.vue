<template>
	<v-dialog v-model="activateViewStaffModal" persistent width="500">
		<v-card>
			<div class="con">
				<div class="headerSec">
					<h2 class="modalTitle">View/Update Staff</h2>
					<v-btn
						color="#4C5B77"
						fab
						dark
						x-small
						@click="cancelViewModal()"
						id="closeBtn"
						><v-icon>mdi-close</v-icon></v-btn
					>
				</div>

				<div class="innerCon">
					<div v-if="showEditDetails">
						<div class="field">
							<div class="fieldLabel">First Name *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="firstNameField"
									v-model="staff.first_name"
									:rules="nameRules"
									counter="30"
								></v-text-field>
							</div>
						</div>

						<div class="field">
							<div class="fieldLabel">Middle Name *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="middleNameField"
									:rules="characterRule"
									v-model="staff.middle_name"
									counter="30"
								></v-text-field>
							</div>
						</div>

						<div class="field">
							<div class="fieldLabel">Last Name *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="lastNameField"
									:rules="nameRules"
									v-model="staff.last_name"
									counter="30"
								></v-text-field>
							</div>
						</div>

						<div class="field roleTye">
							<div class="fieldLabel">Role *</div>
							<div class="select">
								<v-select
									filled
									dense
									:items="roles"
									:rules="required"
									v-model="staff.role"
									id="roleField"
								></v-select>
							</div>
						</div>

						<div class="field">
							<div class="fieldLabel">Email *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									v-model="staff.email"
									counter="30"
									:rules="emailRules"
									id="emailField"
								></v-text-field>
							</div>
						</div>
					</div>

					<div class="loadingAnim" v-if="loading">
						<v-progress-circular
							indeterminate
							color="#596781"
							:size="50"
						></v-progress-circular>
					</div>

					<div v-if="showChangePassword">
						<div class="field">
							<div class="fieldLabel innerTitle">Change Password</div>
						</div>
						<div class="field">
							<div class="fieldLabel">Current Password *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="currentPassword"
									v-model="current_password"
									counter="30"
									:rules="nameRules"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									:type="show1 ? 'text' : 'password'"
									@click:append="show1 = !show1"
								></v-text-field>
							</div>
						</div>
						<div class="field">
							<div class="fieldLabel">New Password *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="newPassword"
									v-model="new_password"
									counter="30"
									:rules="passwordRules"
									:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
									:type="show2 ? 'text' : 'password'"
									@click:append="show2 = !show2"
								></v-text-field>
							</div>
						</div>
					</div>
				</div>

				<div class="btnsCon">
					<v-btn
						text
						color="#4C5B77"
						@click="changePasswordOption()"
						v-if="showEditDetails"
						x-small
						id="changePasswordBtn"
						>Change Password Instead</v-btn
					>

					<v-btn
						text
						color="#4C5B77"
						@click="editDetailsOption()"
						v-if="showChangePassword"
						x-small
						id="editDetailsBtn"
						>Edit Details Instead</v-btn
					>
					<v-btn
						color="#4C5B77"
						:dark="validateUpdateStaff"
						:disabled="!validateUpdateStaff"
						v-if="showEditDetails"
						@click="updateDetails"
						:loading="peopleStore.queryLoading"
						id="updateBtn"
						>Update</v-btn
					>
					<v-btn
						color="#4C5B77"
						:dark="validateChangePassword"
						:disabled="!validateChangePassword"
						v-if="showChangePassword"
						@click="changePassword"
						:loading="peopleStore.queryLoading"
						id="updateBtn"
						>Update</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import { usePeopleStore } from "../../../store/PeopleStore";
	export default {
		props: {
			activateViewStaffModal: Boolean,
			staffData: Object,
		},
		created() {
			this.staff = Object.assign({}, this.staffData);
		},
		data() {
			return {
				peopleStore: usePeopleStore(),
				staff: {
					id: "",
					first_name: "",
					middle_name: "",
					last_name: "",
					role: "",
					email: "",
					password: "",
				},
				activateRules: false,
				current_password: "",
				new_password: "",
				roles: ["admin", "staff"],
				showEditDetails: true,
				showChangePassword: false,
				nameRules: [
					(v) => !!v || "Required",
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				characterRule: [
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				required: [(v) => !!v || "Required"],
				emailRules: [
					(v) => !!v.trim() || "This field is required",
					(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email must be valid",
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				show1: false,
				show2: false,
				loading: false,
			};
		},

		methods: {
			cancelViewModal() {
				this.$emit("cancelViewModal");
			},


			changePasswordOption() {
				this.showEditDetails = false;
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.staff = Object.assign({}, this.staffData);
					this.showChangePassword = true;
				}, 1000);
			},

			editDetailsOption() {
				this.loading = true;
				this.showChangePassword = false;
				setTimeout(() => {
					this.loading = false;
					this.current_password = "";
					this.new_password = "";
					this.showEditDetails = true;
				}, 1000);
			},

			async updateDetails() {
				let updated = {
					id: this.staff.id,
					uuid: this.staff.uuid,
					first_name: this.staff.first_name,
					middle_name: this.staff.middle_name,
					last_name: this.staff.last_name,
					role: this.staff.role,
					email: this.staff.email,
				};

				await this.peopleStore.updateDetails(updated)
				if(this.peopleStore.queryError){
					const message = "Update Failed. Please try again."
					this.$emit("alertError", message);
				}else{
					const message = "Successfully updated."
					this.$emit("alertSuccess", message);
				}
				
			},

			async changePassword() {
				let updated = {
					id: this.staff.id,
					uuid: this.staff.uuid,
					current_password: this.current_password,
					new_password: this.new_password,
				};
				await this.peopleStore.changePassword(updated)
				if(this.peopleStore.queryError){
					const message = "Update Failed. Please try again."
					this.$emit("alertError", message);
				}else{
					const message = "Successfully updated."
					this.$emit("alertSuccess", message);
				}
				
			},
		},

		computed: {
			validateUpdateStaff: function () {
				if (JSON.stringify(this.staff) == JSON.stringify(this.staffData)) {
					return false;
				}
				if (
					this.staff.first_name != "" &&
					this.staff.last_name != "" &&
					this.staff.role != "" &&
					this.staff.email != ""
				) {
					if (
						this.staff.first_name.length <= 30 &&
						this.staff.middle_name.length <= 30 &&
						this.staff.last_name.length <= 30 &&
						this.staff.email.length <= 30
					) {
						if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.staff.email)) {
							return true;
						}
					}
				}

				return false;
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
				if (this.showChangePassword) {
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
				}
			},
		},
	};
</script>
<style scoped>
	.con {
		padding: 40px 40px;
		color: #4b5a76;
		min-height: 500px;
	}

	.modalTitle {
		font-weight: 500;
		padding: 0px 20px;
	}

	.innerCon {
		padding: 20px 0px;
	}

	.left,
	.right {
		width: 100%;
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
		padding: 0px 20px;
	}

	.headerSec {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.innerTitle {
		font-size: 20px;
		margin: 10px 0px;
	}

	.loadingAnim {
		margin: 100px auto;
		text-align: center;
	}

	@media only screen and (max-width: 1250px) {
	}

	@media only screen and (max-width: 1020px) {
	}

	@media only screen and (max-width: 650px) {
		.con {
			padding: 20px;
			color: #4b5a76;
			min-height: 200px;
		}
		.innerCon {
			padding: 20px 0px;
			display: block;
		}

		.left,
		.right {
			width: 100%;
		}
		.fieldLabel {
			font-size: 12px;
		}
		.innerTitle {
			font-size: 20px;
		}
	}
</style>
