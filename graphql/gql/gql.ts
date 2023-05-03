/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation ClassCreate($registrationId: Int!, $registeredClassInput: RegisteredClassInput!) {\n  registeredClassCreate(\n    registeredClassInput: $registeredClassInput\n    registrationID: $registrationId\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassCreateDocument,
    "mutation ClassDelete($registeredClassId: Int!) {\n  registeredClassDelete(registeredClassID: $registeredClassId) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassDeleteDocument,
    "mutation ClassUpdate($registeredClassId: Int!, $registeredClass: RegisteredClassInput!) {\n  registeredClassUpdate(\n    registeredClassID: $registeredClassId\n    registeredClassInput: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassUpdateDocument,
    "mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(communityInput: $community, registrationID: $registrationId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityCreateDocument,
    "mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityDeleteDocument,
    "mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityUpdateDocument,
    "mutation GroupCreate($registrationId: Int!, $group: GroupInput!) {\n  groupCreate(groupInput: $group, registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupCreateDocument,
    "mutation GroupDelete($groupId: Int!) {\n  groupDelete(groupID: $groupId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupDeleteDocument,
    "mutation GroupUpdate($groupId: Int!, $group: GroupInput!) {\n  groupUpdate(groupID: $groupId, groupInput: $group) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupUpdateDocument,
    "mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(performerInput: $performer, registrationID: $registrationId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerCreateDocument,
    "mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n      firstName\n      lastName\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerDeleteDocument,
    "mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerUpdateDocument,
    "mutation RegistrationCreate($performerType: SGSLabel!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationCreateDocument,
    "mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationDeleteDocument,
    "mutation RegistrationUpdate($registrationId: Int!, $registration: RegistrationInput!) {\n  registrationUpdate(registrationID: $registrationId, registration: $registration) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationUpdateDocument,
    "mutation SchoolCreate($registrationId: Int!, $schoolInput: SchoolInput) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $schoolInput) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolCreateDocument,
    "mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolDeleteDocument,
    "mutation SchoolGroupCreate($schoolId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupCreate(schoolGroupInput: $schoolGroup, schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupCreateDocument,
    "mutation SchoolGroupDelete($schoolGroupId: Int!) {\n  schoolGroupDelete(schoolGroupID: $schoolGroupId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupDeleteDocument,
    "mutation SchoolGroupUpdate($schoolGroupId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupUpdate(schoolGroupID: $schoolGroupId, schoolGroupInput: $schoolGroup) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupUpdateDocument,
    "mutation SchoolUpdate($schoolId: Int!, $school: SchoolInput!) {\n  schoolUpdate(schoolID: $schoolId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolUpdateDocument,
    "mutation SelectionCreate($registeredClassId: Int!, $selection: SelectionInput!) {\n  selectionCreate(\n    registeredClassID: $registeredClassId\n    selectionInput: $selection\n  ) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionCreateDocument,
    "mutation SelectionDelete($selectionId: Int!) {\n  selectionDelete(selectionID: $selectionId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionDeleteDocument,
    "mutation SelectionUpdate($selectionId: Int!, $selection: SelectionInput!) {\n  selectionUpdate(selectionID: $selectionId, selectionInput: $selection) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionUpdateDocument,
    "mutation TeacherCreate($registrationId: Int!, $teacher: TeacherInput!) {\n  teacherCreate(registrationID: $registrationId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherCreateDocument,
    "mutation TeacherDelete($teacherId: Int!) {\n  teacherDelete(teacherID: $teacherId) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherDeleteDocument,
    "mutation TeacherUpdate($teacherId: Int!, $teacher: TeacherInput!) {\n  teacherUpdate(teacherID: $teacherId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherUpdateDocument,
    "mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}": types.SignInDocument,
    "mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}": types.SignUpDocument,
    "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    communities {\n      id\n      name\n      groupSize\n      chaperones\n      wheelchairs\n      earliestTime\n      latestTime\n      unavailable\n      conflictPerformers\n    }\n  }\n}": types.CommunityInfoDocument,
    "query DisciplinesByType($SGSLabel: SGSLabel!) {\n  disciplines(SGSLabel: $SGSLabel) {\n    id\n    name\n  }\n}": types.DisciplinesByTypeDocument,
    "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    groups {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}": types.GroupInfoDocument,
    "query PerformerInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    performers {\n      id\n      firstName\n      lastName\n      age\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n      instrument\n      level\n    }\n  }\n}": types.PerformerInfoDocument,
    "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classNumber\n      discipline\n      id\n      level\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}": types.RegisteredClassesDocument,
    "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}": types.SchoolGroupInfoDocument,
    "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}": types.SchoolInfoDocument,
    "query TeacherInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    teacher {\n      id\n      prefix\n      firstName\n      lastName\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}": types.TeacherInfoDocument,
    "query Categories($levelId: Int!, $subdisciplineId: Int!) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}": types.CategoriesDocument,
    "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.ClassByNumberDocument,
    "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    subdiscipline {\n      name\n    }\n    level {\n      name\n    }\n    category {\n      name\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.FestivalClassSearchDocument,
    "query FestivalClasses($SGSLabel: SGSLabel) {\n  festivalClasses(SGSLabel: $SGSLabel) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}": types.FestivalClassesDocument,
    "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}": types.DisciplinesDocument,
    "query Instruments {\n  instruments {\n    id\n    name\n  }\n}": types.InstrumentsDocument,
    "query Levels($subdisciplineId: Int!, $categoryId: Int!) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}": types.LevelsDocument,
    "query Registrations($performerType: SGSLabel!, $userId: Int!) {\n  registrations(performerType: $performerType, userID: $userId) {\n    id\n    createdAt\n    label\n    performerType\n    submittedAt\n    payedAmt\n    totalAmt\n    transactionInfo\n    submission\n  }\n}": types.RegistrationsDocument,
    "query SubDisciplines($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n  }\n}": types.SubDisciplinesDocument,
    "query SubdisciplinesByType($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    SGSLabel\n  }\n}": types.SubdisciplinesByTypeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ClassCreate($registrationId: Int!, $registeredClassInput: RegisteredClassInput!) {\n  registeredClassCreate(\n    registeredClassInput: $registeredClassInput\n    registrationID: $registrationId\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation ClassCreate($registrationId: Int!, $registeredClassInput: RegisteredClassInput!) {\n  registeredClassCreate(\n    registeredClassInput: $registeredClassInput\n    registrationID: $registrationId\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ClassDelete($registeredClassId: Int!) {\n  registeredClassDelete(registeredClassID: $registeredClassId) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation ClassDelete($registeredClassId: Int!) {\n  registeredClassDelete(registeredClassID: $registeredClassId) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ClassUpdate($registeredClassId: Int!, $registeredClass: RegisteredClassInput!) {\n  registeredClassUpdate(\n    registeredClassID: $registeredClassId\n    registeredClassInput: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation ClassUpdate($registeredClassId: Int!, $registeredClass: RegisteredClassInput!) {\n  registeredClassUpdate(\n    registeredClassID: $registeredClassId\n    registeredClassInput: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(communityInput: $community, registrationID: $registrationId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(communityInput: $community, registrationID: $registrationId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation GroupCreate($registrationId: Int!, $group: GroupInput!) {\n  groupCreate(groupInput: $group, registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation GroupCreate($registrationId: Int!, $group: GroupInput!) {\n  groupCreate(groupInput: $group, registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation GroupDelete($groupId: Int!) {\n  groupDelete(groupID: $groupId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation GroupDelete($groupId: Int!) {\n  groupDelete(groupID: $groupId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation GroupUpdate($groupId: Int!, $group: GroupInput!) {\n  groupUpdate(groupID: $groupId, groupInput: $group) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation GroupUpdate($groupId: Int!, $group: GroupInput!) {\n  groupUpdate(groupID: $groupId, groupInput: $group) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(performerInput: $performer, registrationID: $registrationId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(performerInput: $performer, registrationID: $registrationId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n      firstName\n      lastName\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n      firstName\n      lastName\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationCreate($performerType: SGSLabel!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationCreate($performerType: SGSLabel!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationUpdate($registrationId: Int!, $registration: RegistrationInput!) {\n  registrationUpdate(registrationID: $registrationId, registration: $registration) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationUpdate($registrationId: Int!, $registration: RegistrationInput!) {\n  registrationUpdate(registrationID: $registrationId, registration: $registration) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolCreate($registrationId: Int!, $schoolInput: SchoolInput) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $schoolInput) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolCreate($registrationId: Int!, $schoolInput: SchoolInput) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $schoolInput) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolGroupCreate($schoolId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupCreate(schoolGroupInput: $schoolGroup, schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolGroupCreate($schoolId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupCreate(schoolGroupInput: $schoolGroup, schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolGroupDelete($schoolGroupId: Int!) {\n  schoolGroupDelete(schoolGroupID: $schoolGroupId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolGroupDelete($schoolGroupId: Int!) {\n  schoolGroupDelete(schoolGroupID: $schoolGroupId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolGroupUpdate($schoolGroupId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupUpdate(schoolGroupID: $schoolGroupId, schoolGroupInput: $schoolGroup) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolGroupUpdate($schoolGroupId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupUpdate(schoolGroupID: $schoolGroupId, schoolGroupInput: $schoolGroup) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolUpdate($schoolId: Int!, $school: SchoolInput!) {\n  schoolUpdate(schoolID: $schoolId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolUpdate($schoolId: Int!, $school: SchoolInput!) {\n  schoolUpdate(schoolID: $schoolId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SelectionCreate($registeredClassId: Int!, $selection: SelectionInput!) {\n  selectionCreate(\n    registeredClassID: $registeredClassId\n    selectionInput: $selection\n  ) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SelectionCreate($registeredClassId: Int!, $selection: SelectionInput!) {\n  selectionCreate(\n    registeredClassID: $registeredClassId\n    selectionInput: $selection\n  ) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SelectionDelete($selectionId: Int!) {\n  selectionDelete(selectionID: $selectionId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SelectionDelete($selectionId: Int!) {\n  selectionDelete(selectionID: $selectionId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SelectionUpdate($selectionId: Int!, $selection: SelectionInput!) {\n  selectionUpdate(selectionID: $selectionId, selectionInput: $selection) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SelectionUpdate($selectionId: Int!, $selection: SelectionInput!) {\n  selectionUpdate(selectionID: $selectionId, selectionInput: $selection) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TeacherCreate($registrationId: Int!, $teacher: TeacherInput!) {\n  teacherCreate(registrationID: $registrationId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation TeacherCreate($registrationId: Int!, $teacher: TeacherInput!) {\n  teacherCreate(registrationID: $registrationId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TeacherDelete($teacherId: Int!) {\n  teacherDelete(teacherID: $teacherId) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation TeacherDelete($teacherId: Int!) {\n  teacherDelete(teacherID: $teacherId) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TeacherUpdate($teacherId: Int!, $teacher: TeacherInput!) {\n  teacherUpdate(teacherID: $teacherId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation TeacherUpdate($teacherId: Int!, $teacher: TeacherInput!) {\n  teacherUpdate(teacherID: $teacherId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}"): (typeof documents)["mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}"): (typeof documents)["mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    access_token\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    communities {\n      id\n      name\n      groupSize\n      chaperones\n      wheelchairs\n      earliestTime\n      latestTime\n      unavailable\n      conflictPerformers\n    }\n  }\n}"): (typeof documents)["query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    communities {\n      id\n      name\n      groupSize\n      chaperones\n      wheelchairs\n      earliestTime\n      latestTime\n      unavailable\n      conflictPerformers\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DisciplinesByType($SGSLabel: SGSLabel!) {\n  disciplines(SGSLabel: $SGSLabel) {\n    id\n    name\n  }\n}"): (typeof documents)["query DisciplinesByType($SGSLabel: SGSLabel!) {\n  disciplines(SGSLabel: $SGSLabel) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    groups {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}"): (typeof documents)["query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    groups {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PerformerInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    performers {\n      id\n      firstName\n      lastName\n      age\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n      instrument\n      level\n    }\n  }\n}"): (typeof documents)["query PerformerInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    performers {\n      id\n      firstName\n      lastName\n      age\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n      instrument\n      level\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classNumber\n      discipline\n      id\n      level\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"): (typeof documents)["query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classNumber\n      discipline\n      id\n      level\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}"): (typeof documents)["query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}"): (typeof documents)["query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TeacherInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    teacher {\n      id\n      prefix\n      firstName\n      lastName\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"): (typeof documents)["query TeacherInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    teacher {\n      id\n      prefix\n      firstName\n      lastName\n      apartment\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Categories($levelId: Int!, $subdisciplineId: Int!) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}"): (typeof documents)["query Categories($levelId: Int!, $subdisciplineId: Int!) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"): (typeof documents)["query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    subdiscipline {\n      name\n    }\n    level {\n      name\n    }\n    category {\n      name\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"): (typeof documents)["query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classNumber\n    maxSelection\n    minSelection\n    requiredSelection\n    SGSLabel\n    price\n    subdiscipline {\n      name\n    }\n    level {\n      name\n    }\n    category {\n      name\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FestivalClasses($SGSLabel: SGSLabel) {\n  festivalClasses(SGSLabel: $SGSLabel) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query FestivalClasses($SGSLabel: SGSLabel) {\n  festivalClasses(SGSLabel: $SGSLabel) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}"): (typeof documents)["query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Instruments {\n  instruments {\n    id\n    name\n  }\n}"): (typeof documents)["query Instruments {\n  instruments {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Levels($subdisciplineId: Int!, $categoryId: Int!) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"): (typeof documents)["query Levels($subdisciplineId: Int!, $categoryId: Int!) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Registrations($performerType: SGSLabel!, $userId: Int!) {\n  registrations(performerType: $performerType, userID: $userId) {\n    id\n    createdAt\n    label\n    performerType\n    submittedAt\n    payedAmt\n    totalAmt\n    transactionInfo\n    submission\n  }\n}"): (typeof documents)["query Registrations($performerType: SGSLabel!, $userId: Int!) {\n  registrations(performerType: $performerType, userID: $userId) {\n    id\n    createdAt\n    label\n    performerType\n    submittedAt\n    payedAmt\n    totalAmt\n    transactionInfo\n    submission\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SubDisciplines($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n  }\n}"): (typeof documents)["query SubDisciplines($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SubdisciplinesByType($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    SGSLabel\n  }\n}"): (typeof documents)["query SubdisciplinesByType($categoryId: Int!, $disciplineId: Int!, $levelId: Int!, $SGSLabel: SGSLabel!) {\n  subdisciplines(\n    categoryID: $categoryId\n    disciplineID: $disciplineId\n    levelID: $levelId\n    performerType: $SGSLabel\n  ) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    SGSLabel\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;