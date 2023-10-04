<template>
	<div class="resultsSection">
		<div
			class="fetched"
			v-if="questionStore.fetched && !questionStore.resetPanels"
		>
			<div class="notEmpty" v-if="questionStore.total_number_of_questions > 0">
				<div class="resultsHeader">
					<h5 style="color: #4c5b77c9" id="resultCount">
						Results : {{ questionStore.total_number_of_questions }}
						{{
							questionStore.total_number_of_questions > 1
								? "questions"
								: "question"
						}}
					</h5>
				</div>

				<QuestionSection />
				{{ getPage }}

				<br />
				<br />
				<div class="paginationCon">
					<v-pagination
						v-model="page"
						:length="questionStore.total_pages"
						color="#4c5b77"
						:total-visible="7"
					></v-pagination>
				</div>

				<div class="smallSpace"></div>
			</div>
			<div class="empty" v-if="questionStore.total_number_of_questions == 0">
				<Empty />
			</div>
		</div>

		<div class="errorCon" v-if="questionStore.error">
			<Error @refresh="refresh" v-if="this.$route.query.id != 'null'" />
			<div class="deletedQuestion" v-if="this.$route.query.id == 'null'">
				<NotFoundSource />
			</div>
		</div>

		<div
			class="loading"
			v-if="questionStore.loading || questionStore.resetPanels"
		>
			<Loading />
		</div>
	</div>
</template>

<script>
	import QuestionSection from "./QuestionSection.vue";
	import Empty from "../../UtilityComponents/Empty.vue";
	import Loading from "../../UtilityComponents/Loading.vue";
	import Error from "../../UtilityComponents/Error.vue";
	import NotFoundSource from "../../UtilityComponents/NotFoundSource.vue";
	import { useQuestionStore } from "../../../store/QuestionStore";
	export default {
		components: {
			QuestionSection,
			Empty,
			Loading,
			Error,
			NotFoundSource,
		},
		data: () => ({
			questionStore: useQuestionStore(),
			sorted: false,
			page: 1,
		}),
		watch: {
			page() {
				this.questionStore.pageChange(this.page);
				document.body.scrollTop = 0; // For Safari
				document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
			},
		},
		methods: {
			refresh() {
				this.questionStore.getQuestions();
			},
		},
		computed: {
			getPage() {
				this.page = this.questionStore.current_page;
			},
		},
	};
</script>

<style scoped>
	.resultsSection {
		color: #4c5b77;
		overflow: auto;
		padding: 20px 40px;
	}

	.resultsHeader {
		padding-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.paginationCon {
		padding: 15px;
	}

	.empty,
	.loading,
	.errorCon {
		padding: 20px;
	}

	.paginationSmall,
	.smallSpace {
		display: none;
	}

	@media only screen and (max-width: 650px) {
		.resultsSection {
			padding: 20px 20px;
		}

		h5 {
			font-size: 12px;
		}

		/* .paginationCon {
			display: none;
		} */

		.smallSpace {
			display: block;
		}

		.smallSpace {
			padding: 40px;
		}
	}
</style>
