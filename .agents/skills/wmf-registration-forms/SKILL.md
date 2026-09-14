---
name: wmf-registration-forms
description: "Use when changing WMF registration forms, multi-step navigation, performer types, autosave, VeeValidate/Yup validation, classes, performers, or related Pinia stores."
user-invocable: true
---

# WMF Registration Forms

## Form Model

- `app/pages/Form.vue` selects the step sequence from the performer type: solo, group, school, or community.
- Form sections belong in `app/components/form/`; reusable validated controls belong in `app/components/base/`.
- Preserve state synchronization among registration, class, performer, group, and community stores.
- Persist draft form state with the existing session-storage composable and keep the user-visible autosave status intact.

## Validation And State

1. Define or update the VeeValidate and Yup schema at the owning form boundary.
2. Keep field-level validation on blur and full validation on submit.
3. Use store mutations for changes to owned state; use computed values for derived display state.
4. Reset temporary state through the owning store's `$reset()` method.
5. Keep navigation guards and tab error reporting aligned with the active schema.

## Example

Keep performer-specific steps in the page-level tab map and reuse the shared class step:

```ts
const tabs = computed(() => {
	if (performerType.value === 'SOLO') {
		return {
			Performer: FormSoloPerformer,
			Teacher: FormSoloTeacher,
			'Solo Classes': FormTypeClasses,
			Summary,
		}
	}

	return {
		Group: FormGroupInfo,
		Performers: FormGroupPerformers,
		Teacher: FormGroupTeacher,
		'Group Classes': FormTypeClasses,
		Summary,
	}
})
```

SCHOOL and COMMUNITY performer types have their own tab maps (such as `FormSchoolInfo` and `FormCommunityInfo`); the fallback branch above is abbreviated and applies only to GROUP.

## Verification

- Test the affected form step and its store behavior before running the full suite.
- Cover conditional fields, invalid submission, navigation back and forward, autosave restoration, and reset behavior when applicable.
- Use existing Nuxt component and store test setup under `tests/nuxt/`.
