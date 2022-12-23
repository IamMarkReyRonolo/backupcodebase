<template>
	<div>
		{{ updateMetaData }}
		<div class="field">
			<div class="fieldLabel">Grade Level *</div>
			<div class="select">
				<div class="levels">
					<v-btn
						color="#4C5B77"
						dark
						width="40"
						:text="!glevel.selected"
						@click="select(glevel)"
						v-for="(glevel, index) in gradeLevels"
						:key="index"
						class="gradeLevel"
						:id="'selectGrade' + glevel.level"
						><span class="vtext">{{ glevel.level }}</span></v-btn
					>
				</div>

				<div class="details">Associate grade level to this question</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Release Date *</div>
			<div class="select">
				<v-menu
					ref="menu"
					v-model="menu"
					:close-on-content-click="false"
					:return-value.sync="metaData.release_date"
					transition="scale-transition"
					offset-y
					max-width="290px"
					min-width="auto"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="metaData.release_date"
							filled
							dense
							readonly
							v-bind="attrs"
							v-on="on"
							:rules="required"
							id="setReleaseDate"
						></v-text-field>
					</template>
					<v-date-picker
						v-model="metaData.release_date"
						type="month"
						no-title
						scrollable
					>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
						<v-btn
							text
							color="primary"
							@click="$refs.menu.save(metaData.release_date)"
						>
							OK
						</v-btn>
					</v-date-picker>
				</v-menu>
				<div class="details selectDetails">
					Input the release month and year.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			questionMetaData: Object,
		},
		created() {
			this.metaData = this.questionMetaData;
			let hasSelected = false;
			this.gradeLevels.forEach((level) => {
				if (level.level == this.metaData.grade_level) {
					level.selected = true;
					hasSelected = true;
				} else {
					level.selected = false;
				}
			});

			if (!hasSelected) {
				this.gradeLevels[0].selected = true;
				this.metaData.grade_level = this.gradeLevels[0].level;
			}
		},
		data: () => ({
			gradeLevels: [
				{ level: 3, selected: true },
				{ level: 4, selected: false },
				{ level: 5, selected: false },
				{ level: 6, selected: false },
				{ level: 7, selected: false },
				{ level: 8, selected: false },
				{ level: 9, selected: false },
				{ level: 10, selected: false },
				{ level: 11, selected: false },
				{ level: 12, selected: false },
			],
			menu: false,
			metaData: {},
			required: [(v) => !!v || "Required"],
		}),

		methods: {
			select(gLevel) {
				this.gradeLevels.forEach((l) => {
					if (l.level == gLevel.level) {
						l.selected = true;
						this.metaData.grade_level = l.level;
						this.$emit("updateMetaData", this.metaData);
					} else {
						l.selected = false;
					}
				});
			},
		},
		computed: {
			updateMetaData: function () {
				this.$emit("updateMetaData", this.metaData);
			},
		},
	};
</script>

<style scoped>
	.select {
		width: 95%;
	}

	.levels {
		display: flex;
		flex-wrap: wrap;
	}
	.gradeLevel {
		margin-right: 2px;
	}

	.selectDetails {
		margin-top: -20px;
	}
</style>
