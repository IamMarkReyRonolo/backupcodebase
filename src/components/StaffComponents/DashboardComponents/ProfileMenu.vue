<template>
	<v-menu bottom min-width="250px" rounded offset-y>
		<template v-slot:activator="{ on }">
			<v-btn icon v-on="on" id="profileBtn" class="profileBtn">
				<v-avatar color="#4B5A76" size="35">
					<span class="white--text">{{ userdata.initials }}</span>
				</v-avatar>
			</v-btn>
		</template>
		<v-card>
			<v-list-item-content class="justify-center">
				<div class="mx-auto text-center">
					<v-avatar color="#4B5A76" style="margin: 20px 0px">
						<span class="white--text text-h5">{{ userdata.initials }}</span>
					</v-avatar>
					<h4 style="color: #4b5a76">{{ userdata.fullName }}</h4>
					<p class="text-caption mt-1">
						{{ userdata.role }}
					</p>
					<v-divider class="my-3"></v-divider>
					<v-btn
						depressed
						rounded
						text
						@click="activateEditProfileModal()"
						id="editProfileBtn"
					>
						Edit Profile
					</v-btn>
					<v-divider class="my-3"></v-divider>
					<v-btn depressed rounded text @click="logOut()" id="logOutBtn">
						Log out
					</v-btn>
				</div>
			</v-list-item-content>
		</v-card>
	</v-menu>
</template>

<script>
	import { useAdminAuthStore } from "../../../store/AdminAuth";
	export default {
		created() {
			const user = this.adminStore.user;
			this.userdata = {
				initials: user.first_name.split("")[0] + user.last_name.split("")[0],
				fullName:
					user.first_name + " " + user.middle_name + " " + user.last_name,
				role: user.role,
			};
		},
		data: () => ({
			adminStore: useAdminAuthStore(),
			userdata: null,
		}),
		methods: {
			activateEditProfileModal() {
				this.$emit("activateEditProfileModal");
			},

			logOut() {
				localStorage.removeItem("token");
				this.$router.push("/login/x/staff-admin/");
			},
		},
	};
</script>

<style scoped></style>
