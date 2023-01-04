<template>
	<div class="viewQuestions">
		<div class="upper">
			<HeaderSectionVue />
		</div>
		<div class="lower">
			<ResultsSectionVue />
		</div>
		<Snackbar
			:status="status"
			:message="message"
			:snackbar="snackbar"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
	</div>
</template>

<script>
	import HeaderSectionVue from "../../components/StaffComponents/PendingQuestionsComponents/HeaderSection.vue";
	import ResultsSectionVue from "../../components/StaffComponents/PendingQuestionsComponents/ResultsSection.vue";
	import Snackbar from "../../components/GeneralModals/Snackbar.vue";
	import { useQuestionStore } from "../../store/QuestionStore";
	export default {
		components: { HeaderSectionVue, ResultsSectionVue, Snackbar },
		async created() {
			if (this.$route.query.id) {
				await this.questionStore.getSpecificQuestion(this.$route.query.id);
			} else {
				await this.questionStore.getQuestions();
			}

			if (this.questionStore.error) {
				if (this.questionStore.error.request.status == 403) {
					localStorage.removeItem("token");
					const expired_token = true;
					this.$router.push({
						name: "stafflogin",
						params: { expired_token: expired_token },
					});
				}
			}
		},
		data: () => ({
			questionStore: useQuestionStore(),
			snackbar: false,
			message: "",
			status: "",
		}),
		methods: {
			async updateQuestion(parameters) {
				if (parameters.question) {
					this.getData();
					this.message = parameters.message;
					this.status = "Success";
					this.snackbar = true;
				}
			},
		},

		watch: {
			"questionStore.questionDelete"() {
				if (this.questionStore.questionDelete) {
					if (this.questionStore.error) {
						this.message = "An Error Occured. Please try again.";
						this.status = "Error";
						this.snackbar = true;
						this.loadingDialog = false;
					} else {
						this.message = "Successfully deleted question";
						this.status = "Success";
						this.snackbar = true;
						this.loadingDialog = false;
					}
				}
			},
		},
	};
</script>

<style scoped>
	.upper {
		min-height: 30vh;
	}

	.lower {
		background-color: #f5f5f5;
		min-height: 65vh;
	}
</style>
