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
    "mutation ClassCreate($registrationId: Int!, $registeredClass: RegisteredClassInput) {\n  registeredClassCreate(\n    registrationID: $registrationId\n    registeredClass: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassCreateDocument,
    "mutation ClassDelete($registeredClassId: Int!) {\n  registeredClassDelete(registeredClassID: $registeredClassId) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassDeleteDocument,
    "mutation ClassUpdate($registeredClassId: Int!, $registeredClass: RegisteredClassInput!) {\n  registeredClassUpdate(\n    registeredClassID: $registeredClassId\n    registeredClassInput: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.ClassUpdateDocument,
    "mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(registrationID: $registrationId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityCreateDocument,
    "mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityDeleteDocument,
    "mutation CommunityGroupCreate($communityId: Int!) {\n  communityGroupCreate(communityID: $communityId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityGroupCreateDocument,
    "mutation CommunityGroupDelete($communityGroupId: Int!) {\n  communityGroupDelete(communityGroupID: $communityGroupId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityGroupDeleteDocument,
    "mutation CommunityGroupUpdate($communityGroupId: Int!, $communityGroup: CommunityGroupInput!) {\n  communityGroupUpdate(\n    communityGroupID: $communityGroupId\n    communityGroupInput: $communityGroup\n  ) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityGroupUpdateDocument,
    "mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.CommunityUpdateDocument,
    "mutation GroupCreate($registrationId: Int!) {\n  groupCreate(registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupCreateDocument,
    "mutation GroupDelete($groupId: Int!) {\n  groupDelete(groupID: $groupId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupDeleteDocument,
    "mutation GroupUpdate($groupId: Int!, $group: GroupInput!) {\n  groupUpdate(groupID: $groupId, groupInput: $group) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.GroupUpdateDocument,
    "mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(registrationID: $registrationId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerCreateDocument,
    "mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerDeleteDocument,
    "mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.PerformerUpdateDocument,
    "mutation RegistrationCreate($performerType: PerformerType!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationCreateDocument,
    "mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationDeleteDocument,
    "mutation RegistrationUpdate($registrationId: Int!, $registrationInput: RegistrationInput!) {\n  registrationUpdate(\n    registrationID: $registrationId\n    registrationInput: $registrationInput\n  ) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.RegistrationUpdateDocument,
    "mutation SchoolCreate($registrationId: Int!, $school: SchoolInput!) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolCreateDocument,
    "mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolDeleteDocument,
    "mutation SchoolGroupCreate($schoolId: Int!) {\n  schoolGroupCreate(schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupCreateDocument,
    "mutation SchoolGroupDelete($schoolGroupId: Int!) {\n  schoolGroupDelete(schoolGroupID: $schoolGroupId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupDeleteDocument,
    "mutation SchoolGroupUpdate($schoolGroupId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupUpdate(schoolGroupID: $schoolGroupId, schoolGroupInput: $schoolGroup) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolGroupUpdateDocument,
    "mutation SchoolUpdate($schoolId: Int!, $school: SchoolInput!) {\n  schoolUpdate(schoolID: $schoolId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SchoolUpdateDocument,
    "mutation SelectionCreate($registeredClassId: Int!) {\n  selectionCreate(registeredClassID: $registeredClassId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionCreateDocument,
    "mutation SelectionDelete($selectionId: Int!) {\n  selectionDelete(selectionID: $selectionId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionDeleteDocument,
    "mutation SelectionUpdate($selectionId: Int!, $selection: SelectionInput!) {\n  selectionUpdate(selectionID: $selectionId, selectionInput: $selection) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.SelectionUpdateDocument,
    "mutation TeacherCreate($privateTeacher: Boolean!, $schoolTeacher: Boolean!, $teacherInput: TeacherInput!) {\n  teacherCreate(\n    privateTeacher: $privateTeacher\n    schoolTeacher: $schoolTeacher\n    teacherInput: $teacherInput\n  ) {\n    teacher {\n      id\n      email\n      firstName\n      lastName\n      privateTeacher\n      schoolTeacher\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherCreateDocument,
    "mutation TeacherDelete($teacherId: Int!) {\n  teacherDelete(teacherID: $teacherId) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherDeleteDocument,
    "mutation TeacherUpdate($teacherId: Int!, $teacher: TeacherInput!) {\n  teacherUpdate(teacherID: $teacherId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.TeacherUpdateDocument,
    "mutation UserUpdate($userId: Int!, $user: UserInput!) {\n  userUpdate(userID: $userId, userInput: $user) {\n    user {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.UserUpdateDocument,
    "mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    diatonicToken\n    user {\n      email\n      firstName\n      lastName\n      privateTeacher\n      hasSignedIn\n    }\n  }\n}": types.SignInDocument,
    "mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    user {\n      email\n    }\n  }\n}": types.SignUpDocument,
    "query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}": types.CommunityGroupInfoDocument,
    "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}": types.CommunityInfoDocument,
    "query DisciplinesByType($performerType: PerformerType!) {\n  disciplines(performerType: $performerType) {\n    id\n    name\n    instruments {\n      id\n      name\n      mozart\n    }\n  }\n}": types.DisciplinesByTypeDocument,
    "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    group {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}": types.GroupInfoDocument,
    "query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    firstName\n    lastName\n    age\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n  }\n}": types.PerformersDocument,
    "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}": types.RegisteredClassesDocument,
    "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}": types.SchoolGroupInfoDocument,
    "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}": types.SchoolInfoDocument,
    "query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}": types.TeacherInfoDocument,
    "query AllTeachersSearch($privateTeacher: Boolean!, $schoolTeacher: Boolean!) {\n  teachers(privateTeacher: $privateTeacher, schoolTeacher: $schoolTeacher) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}": types.AllTeachersSearchDocument,
    "query Categories($levelId: Int, $subdisciplineId: Int) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}": types.CategoriesDocument,
    "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.ClassByNumberDocument,
    "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classType {\n      name\n      description\n    }\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    description\n    subdiscipline {\n      name\n      description\n    }\n    level {\n      name\n      description\n    }\n    category {\n      name\n      description\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.FestivalClassSearchDocument,
    "query FestivalClasses($performerType: PerformerType) {\n  festivalClasses(performerType: $performerType) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}": types.FestivalClassesDocument,
    "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}": types.DisciplinesDocument,
    "query FieldConfig($fieldName: String!, $tableName: String!) {\n  fieldConfig(fieldName: $fieldName, tableName: $tableName) {\n    id\n    tableName\n    fieldName\n    customField\n    customFieldType\n    submissionRequired\n    __typename\n  }\n}": types.FieldConfigDocument,
    "query FieldConfigs {\n  fieldConfigs {\n    tableName\n    fieldName\n    communityRequired\n    groupRequired\n    schoolRequired\n    soloRequired\n    customField\n    customFieldType\n  }\n}": types.FieldConfigsDocument,
    "query instrument($instrumentId: Int, $instrumentName: String) {\n  instrument(id: $instrumentId, name: $instrumentName) {\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": types.instrumentDocument,
    "query Instruments {\n  instruments {\n    id\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": types.InstrumentsDocument,
    "query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}": types.LevelsDocument,
    "query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}": types.MyUserDocument,
    "query Registrations($performerType: PerformerType) {\n  registrations(performerType: $performerType) {\n    id\n    confirmation\n    label\n    payedAmt\n    performerType\n    submittedAt\n    teacher {\n      id\n    }\n    totalAmt\n    transactionInfo\n    createdAt\n    updatedAt\n  }\n}": types.RegistrationsDocument,
    "query StudentRegistrations {\n  myStudents {\n    registrations {\n      confirmation\n      createdAt\n      id\n      label\n      performerType\n      submittedAt\n      updatedAt\n      performers {\n        firstName\n        lastName\n      }\n      group {\n        name\n      }\n      school {\n        name\n      }\n      community {\n        name\n      }\n    }\n  }\n}": types.StudentRegistrationsDocument,
    "query SubDisciplines($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n  }\n}": types.SubDisciplinesDocument,
    "query SubdisciplinesByType($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    performerType\n  }\n}": types.SubdisciplinesByTypeDocument,
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
export function graphql(source: "mutation ClassCreate($registrationId: Int!, $registeredClass: RegisteredClassInput) {\n  registeredClassCreate(\n    registrationID: $registrationId\n    registeredClass: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation ClassCreate($registrationId: Int!, $registeredClass: RegisteredClassInput) {\n  registeredClassCreate(\n    registrationID: $registrationId\n    registeredClass: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(registrationID: $registrationId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(registrationID: $registrationId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityGroupCreate($communityId: Int!) {\n  communityGroupCreate(communityID: $communityId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityGroupCreate($communityId: Int!) {\n  communityGroupCreate(communityID: $communityId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityGroupDelete($communityGroupId: Int!) {\n  communityGroupDelete(communityGroupID: $communityGroupId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityGroupDelete($communityGroupId: Int!) {\n  communityGroupDelete(communityGroupID: $communityGroupId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityGroupUpdate($communityGroupId: Int!, $communityGroup: CommunityGroupInput!) {\n  communityGroupUpdate(\n    communityGroupID: $communityGroupId\n    communityGroupInput: $communityGroup\n  ) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityGroupUpdate($communityGroupId: Int!, $communityGroup: CommunityGroupInput!) {\n  communityGroupUpdate(\n    communityGroupID: $communityGroupId\n    communityGroupInput: $communityGroup\n  ) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation GroupCreate($registrationId: Int!) {\n  groupCreate(registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation GroupCreate($registrationId: Int!) {\n  groupCreate(registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(registrationID: $registrationId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(registrationID: $registrationId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationCreate($performerType: PerformerType!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationCreate($performerType: PerformerType!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegistrationUpdate($registrationId: Int!, $registrationInput: RegistrationInput!) {\n  registrationUpdate(\n    registrationID: $registrationId\n    registrationInput: $registrationInput\n  ) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation RegistrationUpdate($registrationId: Int!, $registrationInput: RegistrationInput!) {\n  registrationUpdate(\n    registrationID: $registrationId\n    registrationInput: $registrationInput\n  ) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolCreate($registrationId: Int!, $school: SchoolInput!) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolCreate($registrationId: Int!, $school: SchoolInput!) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SchoolGroupCreate($schoolId: Int!) {\n  schoolGroupCreate(schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SchoolGroupCreate($schoolId: Int!) {\n  schoolGroupCreate(schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation SelectionCreate($registeredClassId: Int!) {\n  selectionCreate(registeredClassID: $registeredClassId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation SelectionCreate($registeredClassId: Int!) {\n  selectionCreate(registeredClassID: $registeredClassId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation TeacherCreate($privateTeacher: Boolean!, $schoolTeacher: Boolean!, $teacherInput: TeacherInput!) {\n  teacherCreate(\n    privateTeacher: $privateTeacher\n    schoolTeacher: $schoolTeacher\n    teacherInput: $teacherInput\n  ) {\n    teacher {\n      id\n      email\n      firstName\n      lastName\n      privateTeacher\n      schoolTeacher\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation TeacherCreate($privateTeacher: Boolean!, $schoolTeacher: Boolean!, $teacherInput: TeacherInput!) {\n  teacherCreate(\n    privateTeacher: $privateTeacher\n    schoolTeacher: $schoolTeacher\n    teacherInput: $teacherInput\n  ) {\n    teacher {\n      id\n      email\n      firstName\n      lastName\n      privateTeacher\n      schoolTeacher\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation UserUpdate($userId: Int!, $user: UserInput!) {\n  userUpdate(userID: $userId, userInput: $user) {\n    user {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation UserUpdate($userId: Int!, $user: UserInput!) {\n  userUpdate(userID: $userId, userInput: $user) {\n    user {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    diatonicToken\n    user {\n      email\n      firstName\n      lastName\n      privateTeacher\n      hasSignedIn\n    }\n  }\n}"): (typeof documents)["mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    diatonicToken\n    user {\n      email\n      firstName\n      lastName\n      privateTeacher\n      hasSignedIn\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    user {\n      email\n    }\n  }\n}"): (typeof documents)["mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    user {\n      email\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}"): (typeof documents)["query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"): (typeof documents)["query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      streetNumber\n      streetName\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DisciplinesByType($performerType: PerformerType!) {\n  disciplines(performerType: $performerType) {\n    id\n    name\n    instruments {\n      id\n      name\n      mozart\n    }\n  }\n}"): (typeof documents)["query DisciplinesByType($performerType: PerformerType!) {\n  disciplines(performerType: $performerType) {\n    id\n    name\n    instruments {\n      id\n      name\n      mozart\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    group {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}"): (typeof documents)["query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    group {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    firstName\n    lastName\n    age\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n  }\n}"): (typeof documents)["query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    firstName\n    lastName\n    age\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"): (typeof documents)["query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"];
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
export function graphql(source: "query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}"): (typeof documents)["query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AllTeachersSearch($privateTeacher: Boolean!, $schoolTeacher: Boolean!) {\n  teachers(privateTeacher: $privateTeacher, schoolTeacher: $schoolTeacher) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}"): (typeof documents)["query AllTeachersSearch($privateTeacher: Boolean!, $schoolTeacher: Boolean!) {\n  teachers(privateTeacher: $privateTeacher, schoolTeacher: $schoolTeacher) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Categories($levelId: Int, $subdisciplineId: Int) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}"): (typeof documents)["query Categories($levelId: Int, $subdisciplineId: Int) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"): (typeof documents)["query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classType {\n      name\n      description\n    }\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    description\n    subdiscipline {\n      name\n      description\n    }\n    level {\n      name\n      description\n    }\n    category {\n      name\n      description\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"): (typeof documents)["query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classType {\n      name\n      description\n    }\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    description\n    subdiscipline {\n      name\n      description\n    }\n    level {\n      name\n      description\n    }\n    category {\n      name\n      description\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FestivalClasses($performerType: PerformerType) {\n  festivalClasses(performerType: $performerType) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query FestivalClasses($performerType: PerformerType) {\n  festivalClasses(performerType: $performerType) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}"): (typeof documents)["query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FieldConfig($fieldName: String!, $tableName: String!) {\n  fieldConfig(fieldName: $fieldName, tableName: $tableName) {\n    id\n    tableName\n    fieldName\n    customField\n    customFieldType\n    submissionRequired\n    __typename\n  }\n}"): (typeof documents)["query FieldConfig($fieldName: String!, $tableName: String!) {\n  fieldConfig(fieldName: $fieldName, tableName: $tableName) {\n    id\n    tableName\n    fieldName\n    customField\n    customFieldType\n    submissionRequired\n    __typename\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FieldConfigs {\n  fieldConfigs {\n    tableName\n    fieldName\n    communityRequired\n    groupRequired\n    schoolRequired\n    soloRequired\n    customField\n    customFieldType\n  }\n}"): (typeof documents)["query FieldConfigs {\n  fieldConfigs {\n    tableName\n    fieldName\n    communityRequired\n    groupRequired\n    schoolRequired\n    soloRequired\n    customField\n    customFieldType\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query instrument($instrumentId: Int, $instrumentName: String) {\n  instrument(id: $instrumentId, name: $instrumentName) {\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}"): (typeof documents)["query instrument($instrumentId: Int, $instrumentName: String) {\n  instrument(id: $instrumentId, name: $instrumentName) {\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Instruments {\n  instruments {\n    id\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}"): (typeof documents)["query Instruments {\n  instruments {\n    id\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"): (typeof documents)["query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}"): (typeof documents)["query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    apartment\n    streetNumber\n    streetName\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Registrations($performerType: PerformerType) {\n  registrations(performerType: $performerType) {\n    id\n    confirmation\n    label\n    payedAmt\n    performerType\n    submittedAt\n    teacher {\n      id\n    }\n    totalAmt\n    transactionInfo\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Registrations($performerType: PerformerType) {\n  registrations(performerType: $performerType) {\n    id\n    confirmation\n    label\n    payedAmt\n    performerType\n    submittedAt\n    teacher {\n      id\n    }\n    totalAmt\n    transactionInfo\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query StudentRegistrations {\n  myStudents {\n    registrations {\n      confirmation\n      createdAt\n      id\n      label\n      performerType\n      submittedAt\n      updatedAt\n      performers {\n        firstName\n        lastName\n      }\n      group {\n        name\n      }\n      school {\n        name\n      }\n      community {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["query StudentRegistrations {\n  myStudents {\n    registrations {\n      confirmation\n      createdAt\n      id\n      label\n      performerType\n      submittedAt\n      updatedAt\n      performers {\n        firstName\n        lastName\n      }\n      group {\n        name\n      }\n      school {\n        name\n      }\n      community {\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SubDisciplines($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n  }\n}"): (typeof documents)["query SubDisciplines($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SubdisciplinesByType($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    performerType\n  }\n}"): (typeof documents)["query SubdisciplinesByType($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    performerType\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;