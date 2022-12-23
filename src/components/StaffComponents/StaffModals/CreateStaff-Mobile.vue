<template>
	<v-dialog
		v-model="activateCreateStaffModalMobile"
		persistent
		width="500"
		fullscreen
	>
		<v-card>
			<div class="con">
				<div class="headerSec">
					<h2 class="modalTitle">Create Staff</h2>
					<v-btn
						color="#4C5B77"
						fab
						dark
						x-small
						@click="cancelCreate()"
						id="closeBtn"
						><v-icon>mdi-close</v-icon></v-btn
					>
				</div>

				<div class="innerCon">
					<div v-if="firstStep">
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
							<div class="fieldLabel">Middle Name</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="middleNameField"
									:rules="characterRule"
									v-model="staff.middle_name"
									counter="30"
									hint="not required"
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
									id="roleField"
									:items="roles"
									:rules="required"
									v-model="staff.role"
								></v-select>
							</div>
						</div>
					</div>

					<div v-if="secondStep">
						<div class="field">
							<div class="fieldLabel">email *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="emailField"
									v-model="staff.email"
									counter="30"
									:rules="usernameRules"
								></v-text-field>
							</div>
						</div>

						<div class="field">
							<div class="fieldLabel">Password *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="passwordField"
									v-model="staff.password"
									counter="30"
									:rules="passwordRules"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									:type="show1 ? 'text' : 'password'"
									@click:append="show1 = !show1"
								></v-text-field>
							</div>
						</div>
						<div class="field">
							<div class="fieldLabel">Repeat Password *</div>
							<div class="select">
								<v-text-field
									filled
									dense
									id="repeatPasswordField"
									v-model="repeat_password"
									counter="30"
									:rules="repeatPasswordRules"
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
						@click="prevStep()"
						:disabled="!secondStep"
						id="prevBtn"
						>Previous</v-btn
					>
					<v-btn
						color="#4C5B77"
						:dark="validateFirstStep"
						@click="nextStep()"
						:disabled="!validateFirstStep"
						v-if="firstStep"
						id="nextBtn"
						>Next</v-btn
					>
					<v-btn
						color="#4C5B77"
						:dark="validateSecondStep"
						:disabled="!validateSecondStep"
						@click="createStaff"
						:loading="peopleStore.queryLoading"
						v-if="secondStep"
						id="createStaffBtn"
						>Create</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import { usePeopleStore } from "../../../store/PeopleStore";
	export default {
		props: { activateCreateStaffModalMobile: Boolean, },
		data() {
			return {
				peopleStore: usePeopleStore(),
				staff: {
					first_name: "",
					middle_name: "",
					last_name: "",
					role: "",
					email: "",
					password: "",
				},
				activateRules: false,
				repeat_password: "",
				roles: ["admin", "staff"],
				firstStep: true,
				secondStep: false,
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
				usernameRules: [
					(v) => !!v.trim() || "This field is required",
					(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email must be valid",
					(v) =>
						v ? v.length <= 30 || "Exceeded number of characters" : true || "",
				],
				show1: false,
				show2: false,
			};
		},

		methods: {
			cancelCreate() {
				this.$emit("cancelCreate");
			},

			async createStaff() {
				this.staff.repeat_password = this.repeat_password;
				await this.peopleStore.createStaff(this.staff)
				if(this.peopleStore.error){
					const message = "Registration failed. Please try again"
					this.$emit("alerterror", message);
				}else{
					const message = "Successfully added to the database"
					this.$emit("alertSuccess", message);
					this.resetForm()
				}
			},

			resetForm(){
				this.staff =  {
						first_name: "",
						middle_name: "",
						last_name: "",
						role: "",
						email: "",
						repeat_password: "",
						password: "",
					};
			},

			nextStep() {
				this.firstStep = false;
				this.secondStep = true;
			},

			prevStep() {
				this.firstStep = true;
				this.secondStep = false;
			},
		},

		computed: {
			validateFirstStep: function () {
				if (
					this.staff.first_name != "" &&
					this.staff.last_name != "" &&
					this.staff.role != ""
				) {
					if (
						this.staff.first_name.length <= 30 &&
						this.staff.middle_name.length <= 30 &&
						this.staff.last_name.length <= 30
					) {
						return true;
					}
				}

				return false;
			},

			validateSecondStep: function () {
				if (
					this.staff.email != "" &&
					this.repeatPasswordRules[0] == true &&
					this.passwordRules[0] == true
				) {
					{
						if (this.staff.email.length <= 30) {
							if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.staff.email)) {
								return true;
							}
						}
					}
				}

				return false;
			},

			passwordRules: function () {
				if (this.secondStep) {
					if (this.staff.password == "") {
						return ["Required"];
					}

					if (this.staff.password.length > 30) {
						return ["Exceeded number of characters"];
					}

					if (this.staff.password.length < 8) {
						return ["Minimum of 8 characters"];
					}

					if (!/^(?=.*?[a-z])/.test(this.staff.password)) {
						return ["Password must have lowercase letter."];
					}

					if (!/^(?=.*?[A-Z])/.test(this.staff.password)) {
						return ["Password must have uppercase letter."];
					}

					if (!/^(?=.*?[0-9])/.test(this.staff.password)) {
						return ["Password must have a number."];
					}

					if (!/^(?=.*?[#?!@$%^&*-])/.test(this.staff.password)) {
						return ["Password must have a character."];
					}

					return [true];
				}
			},

			repeatPasswordRules: function () {
				if (this.secondStep) {
					if (this.repeat_password == "") {
						return ["Required"];
					}

					if (this.staff.password != this.repeat_password) {
						return ["Password do not match"];
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
		min-height: 400px;
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
	}
</style>
