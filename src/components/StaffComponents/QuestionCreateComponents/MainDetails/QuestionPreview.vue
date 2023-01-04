<template>
	<div class="questionPreviewCon">
		<v-expansion-panels focusable>
			<v-expansion-panel>
				<v-expansion-panel-header>Question Preview</v-expansion-panel-header>
				<v-expansion-panel-content eager>
					<div class="field">
						<div
							class="noPreview"
							id="noPreview"
							v-if="!questionStore.createQuestion.question_content"
						>
							No Preview
						</div>
						<div
							class="preview"
							v-if="questionStore.createQuestion.question_content"
							id="hasPreview"
						>
							<div class="fieldLabel">Question:</div>
							<div>
								<vue-mathjax
									:formula="questionStore.createQuestion.question_content + ' '"
									v-if="count % 2 == 0"
								></vue-mathjax>
								<vue-mathjax
									:formula="questionStore.createQuestion.question_content"
									v-if="count % 2 != 0"
								></vue-mathjax>
								<div style="margin: 10px auto; width: 200px">
									<img
										:src="questionStore.createQuestion.question_img"
										alt=""
										width="200"
										v-if="questionStore.createQuestion.question_img != ''"
									/>
								</div>
							</div>

							<br />
							<div
								class="fieldLabel"
								v-if="
									questionStore.createQuestion.response_type ==
										'Open Response Exact' ||
									questionStore.createQuestion.response_type ==
										'Range Open Response'
								"
							>
								Answer:
							</div>
							<div
								class="fieldLabel"
								v-if="
									questionStore.createQuestion.response_type ==
										'Multiple Choice' ||
									questionStore.createQuestion.response_type == 'Checkboxes'
								"
							>
								Options:
							</div>

							<div
								class="answerCon"
								v-for="(value, index) in questionStore.createQuestion.options"
								:key="index"
							>
								<div
									v-if="
										questionStore.createQuestion.response_type ==
											'Multiple Choice' ||
										questionStore.createQuestion.response_type == 'Checkboxes'
									"
								>
									<div>
										<div>
											<span style="font-weight: bold">{{ value.letter }}.</span>

											<vue-mathjax
												:formula="value.content + ' '"
												v-if="value.content && count % 2 == 0"
												style="margin: 0px 15px"
											></vue-mathjax>
											<vue-mathjax
												:formula="value.content"
												v-if="value.content && count % 2 != 0"
												style="margin: 0px 15px"
											></vue-mathjax>

											<span v-if="!value.content" style="margin: 0px 15px"
												>No Content</span
											>
											<span
												v-if="value.is_answer"
												style="font-weight: bold; font-size: 14px"
												>Correct Answer</span
											>
										</div>
									</div>
									<div style="margin: 20px">
										<img
											:src="value.image"
											alt=""
											width="200"
											v-if="value.image != ''"
										/>
									</div>
								</div>
								<div>
									<div
										v-if="
											questionStore.createQuestion.response_type ==
											'Open Response Exact'
										"
									>
										<vue-mathjax
											:formula="value.content + ' '"
											v-if="value.content && count % 2 == 0"
											style="margin: 0px 15px"
										></vue-mathjax>
										<vue-mathjax
											:formula="value.content"
											v-if="value.content && count % 2 != 0"
											style="margin: 0px 15px"
										></vue-mathjax>
										<span v-if="!value.content" style="margin: 0px 15px"
											>No Content</span
										>
										<vue-mathjax
											:formula="value.unit"
											v-if="value.unit"
											style="margin: 0px 15px"
										></vue-mathjax>
									</div>
									<div
										v-if="
											questionStore.createQuestion.response_type ==
											'Range Open Response'
										"
									>
										<span style="font-weight: bold" v-if="index == 0"
											>Min:
										</span>
										<span style="font-weight: bold" v-if="index == 1"
											>Max:
										</span>
										<vue-mathjax
											:formula="value.content + ' '"
											v-if="value.content && count % 2 == 0"
											style="margin: 0px 15px"
										></vue-mathjax>
										<vue-mathjax
											:formula="value.content"
											v-if="value.content && count % 2 != 0"
											style="margin: 0px 15px"
										></vue-mathjax>
										<vue-mathjax
											:formula="value.unit"
											v-if="value.unit"
											style="margin: 0px 15px"
										></vue-mathjax>
										<span v-if="!value.content" style="margin: 0px 15px"
											>No Content</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
	import { VueMathjax } from "vue-mathjax";
	import { useQuestionStore } from "../../../../store/QuestionStore";
	export default {
		components: { "vue-mathjax": VueMathjax },
		data: () => ({
			questionStore: useQuestionStore(),
			count: 0,
			img: "",
		}),
		methods: {},
	};
</script>

<style scoped>
	.field {
		color: #4c5b77;
		padding: 20px;
	}

	.fieldLabel {
		padding-bottom: 20px;
		font-weight: bold;
		font-size: 14px;
	}
</style>
