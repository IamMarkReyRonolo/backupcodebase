<template>
	<v-row justify="center">
		<v-dialog
			v-model="dialog"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card>
				<v-toolbar dark color="#4b5a76">
					<v-btn icon dark @click="closeUpdate('close')" id="closeBtn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-toolbar-title class="small">Update Question</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-toolbar>

				<Update :data="question" @closeUpdate="closeUpdate" />
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
	import Update from "../../views/Admin/StaffUpdateQuestion.vue";
	import UpdateQuestion from "../StaffComponents/UpdateQuestionComponents/UpdateQuestion.vue";

	export default {
		props: {
			updateDialog: Boolean,
			question: Object,
		},
		created() {
			this.dialog = this.updateDialog;
		},

		components: {
			Update,
			UpdateQuestion,
		},
		data() {
			return {
				updatedQuestion: {},
				dialog: false,
			};
		},

		methods: {
			closeUpdate(message) {
				this.$emit("closeUpdate", message);
			},
		},

		watch: {
			dialog() {
				if (!this.dialog) {
					this.$emit("closeUpdate", "close");
				}
			},
		},
	};
</script>

<style scoped>
	@media only screen and (max-width: 600px) {
		.small {
			font-size: 18px;
		}
	}
</style>
