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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query Logout {\n      logout\n    }\n  ": typeof types.LogoutDocument,
    "mutation ClassCreate($registrationId: Int!, $registeredClass: RegisteredClassInput) {\n  registeredClassCreate(\n    registrationID: $registrationId\n    registeredClass: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.ClassCreateDocument,
    "mutation ClassDelete($registeredClassId: Int!) {\n  registeredClassDelete(registeredClassID: $registeredClassId) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.ClassDeleteDocument,
    "mutation ClassUpdate($registeredClassId: Int!, $registeredClass: RegisteredClassInput!) {\n  registeredClassUpdate(\n    registeredClassID: $registeredClassId\n    registeredClassInput: $registeredClass\n  ) {\n    registeredClass {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.ClassUpdateDocument,
    "mutation CommunityCreate($registrationId: Int!, $community: CommunityInput!) {\n  communityCreate(registrationID: $registrationId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityCreateDocument,
    "mutation CommunityDelete($communityId: Int!) {\n  communityDelete(communityID: $communityId) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityDeleteDocument,
    "mutation CommunityGroupCreate($communityId: Int!) {\n  communityGroupCreate(communityID: $communityId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityGroupCreateDocument,
    "mutation CommunityGroupDelete($communityGroupId: Int!) {\n  communityGroupDelete(communityGroupID: $communityGroupId) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityGroupDeleteDocument,
    "mutation CommunityGroupUpdate($communityGroupId: Int!, $communityGroup: CommunityGroupInput!) {\n  communityGroupUpdate(\n    communityGroupID: $communityGroupId\n    communityGroupInput: $communityGroup\n  ) {\n    communityGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityGroupUpdateDocument,
    "mutation CommunityUpdate($communityId: Int!, $community: CommunityInput!) {\n  communityUpdate(communityID: $communityId, communityInput: $community) {\n    community {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.CommunityUpdateDocument,
    "mutation GroupCreate($registrationId: Int!) {\n  groupCreate(registrationID: $registrationId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.GroupCreateDocument,
    "mutation GroupDelete($groupId: Int!) {\n  groupDelete(groupID: $groupId) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.GroupDeleteDocument,
    "mutation GroupUpdate($groupId: Int!, $group: GroupInput!) {\n  groupUpdate(groupID: $groupId, groupInput: $group) {\n    group {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.GroupUpdateDocument,
    "mutation ItemCreate($itemInput: ItemInput!) {\n  itemCreate(ItemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.ItemCreateDocument,
    "mutation ItemDelete($itemDeleteId: Int!) {\n  itemDelete(id: $itemDeleteId) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.ItemDeleteDocument,
    "mutation ItemUpdate($itemUpdateId: Int!, $itemInput: ItemInput!) {\n  itemUpdate(id: $itemUpdateId, itemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.ItemUpdateDocument,
    "mutation OrderCreate($orderInput: OrderInput!) {\n  orderCreate(orderInput: $orderInput) {\n    order {\n      id\n      totalAmount\n      purchaseDate\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.OrderCreateDocument,
    "mutation OrderDelete($orderId: Int!) {\n  orderDelete(orderID: $orderId) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.OrderDeleteDocument,
    "mutation OrderItemCreate($orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemCreate(orderID: $orderId, orderItemInput: $orderItemInput) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.OrderItemCreateDocument,
    "mutation OrderItemDelete($itemId: Int!, $orderId: Int!) {\n  orderItemDelete(itemID: $itemId, orderID: $orderId) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.OrderItemDeleteDocument,
    "mutation OrderItemUpdate($itemId: Int!, $orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemUpdate(\n    itemID: $itemId\n    orderID: $orderId\n    orderItemInput: $orderItemInput\n  ) {\n    orderItem {\n      itemID\n      orderID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.OrderItemUpdateDocument,
    "mutation OrderUpdate($orderId: Int!, $orderInput: OrderInput!) {\n  orderUpdate(orderID: $orderId, orderInput: $orderInput) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": typeof types.OrderUpdateDocument,
    "mutation PerformerCreate($registrationId: Int!, $performer: PerformerInput!) {\n  performerCreate(registrationID: $registrationId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.PerformerCreateDocument,
    "mutation PerformerDelete($performerId: Int!) {\n  performerDelete(performerID: $performerId) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.PerformerDeleteDocument,
    "mutation PerformerUpdate($performerId: Int!, $performer: PerformerInput!) {\n  performerUpdate(performerID: $performerId, performerInput: $performer) {\n    performer {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.PerformerUpdateDocument,
    "mutation RegistrationCreate($performerType: PerformerType!, $label: String!) {\n  registrationCreate(performerType: $performerType, label: $label) {\n    registration {\n      id\n      label\n      performerType\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.RegistrationCreateDocument,
    "mutation RegistrationDelete($registrationId: Int!) {\n  registrationDelete(registrationID: $registrationId) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.RegistrationDeleteDocument,
    "mutation RegistrationUpdate($registrationId: Int!, $registrationInput: RegistrationInput!) {\n  registrationUpdate(\n    registrationID: $registrationId\n    registrationInput: $registrationInput\n  ) {\n    registration {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.RegistrationUpdateDocument,
    "mutation SchoolCreate($registrationId: Int!, $school: SchoolInput!) {\n  schoolCreate(registrationID: $registrationId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolCreateDocument,
    "mutation SchoolDelete($schoolId: Int!) {\n  schoolDelete(schoolID: $schoolId) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolDeleteDocument,
    "mutation SchoolGroupCreate($schoolId: Int!) {\n  schoolGroupCreate(schoolID: $schoolId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolGroupCreateDocument,
    "mutation SchoolGroupDelete($schoolGroupId: Int!) {\n  schoolGroupDelete(schoolGroupID: $schoolGroupId) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolGroupDeleteDocument,
    "mutation SchoolGroupUpdate($schoolGroupId: Int!, $schoolGroup: SchoolGroupInput!) {\n  schoolGroupUpdate(schoolGroupID: $schoolGroupId, schoolGroupInput: $schoolGroup) {\n    schoolGroup {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolGroupUpdateDocument,
    "mutation SchoolUpdate($schoolId: Int!, $school: SchoolInput!) {\n  schoolUpdate(schoolID: $schoolId, schoolInput: $school) {\n    school {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SchoolUpdateDocument,
    "mutation SelectionCreate($registeredClassId: Int!) {\n  selectionCreate(registeredClassID: $registeredClassId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SelectionCreateDocument,
    "mutation SelectionDelete($selectionId: Int!) {\n  selectionDelete(selectionID: $selectionId) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SelectionDeleteDocument,
    "mutation SelectionUpdate($selectionId: Int!, $selection: SelectionInput!) {\n  selectionUpdate(selectionID: $selectionId, selectionInput: $selection) {\n    selection {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.SelectionUpdateDocument,
    "mutation TeacherCreate($privateTeacher: Boolean!, $schoolTeacher: Boolean!, $teacherInput: TeacherInput!) {\n  teacherCreate(\n    privateTeacher: $privateTeacher\n    schoolTeacher: $schoolTeacher\n    teacherInput: $teacherInput\n  ) {\n    teacher {\n      id\n      email\n      firstName\n      lastName\n      privateTeacher\n      schoolTeacher\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.TeacherCreateDocument,
    "mutation TeacherDelete($teacherId: Int!) {\n  teacherDelete(teacherID: $teacherId) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.TeacherDeleteDocument,
    "mutation TeacherUpdate($teacherId: Int!, $teacher: TeacherInput!) {\n  teacherUpdate(teacherID: $teacherId, teacherInput: $teacher) {\n    teacher {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.TeacherUpdateDocument,
    "mutation UserUpdate($userId: Int!, $user: UserInput!) {\n  userUpdate(userID: $userId, userInput: $user) {\n    user {\n      id\n    }\n    userErrors {\n      message\n    }\n  }\n}": typeof types.UserUpdateDocument,
    "mutation SignIn($credentials: CredentialsSignin!) {\n  signin(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    diatonicToken\n    user {\n      email\n      firstName\n      lastName\n      privateTeacher\n      hasSignedIn\n    }\n  }\n}": typeof types.SignInDocument,
    "mutation SignUp($credentials: CredentialsSignup!) {\n  signup(credentials: $credentials) {\n    userErrors {\n      message\n    }\n    user {\n      email\n    }\n  }\n}": typeof types.SignUpDocument,
    "query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}": typeof types.CommunityGroupInfoDocument,
    "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      address\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}": typeof types.CommunityInfoDocument,
    "query DisciplinesByType($performerType: PerformerType!) {\n  disciplines(performerType: $performerType) {\n    id\n    name\n    instruments {\n      id\n      name\n      mozart\n    }\n  }\n}": typeof types.DisciplinesByTypeDocument,
    "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    group {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}": typeof types.GroupInfoDocument,
    "query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    pronouns\n    firstName\n    lastName\n    age\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n    otherClasses\n    unavailable\n    photoPermission\n  }\n}": typeof types.PerformersDocument,
    "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      communityGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}": typeof types.RegisteredClassesDocument,
    "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}": typeof types.SchoolGroupInfoDocument,
    "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      address\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}": typeof types.SchoolInfoDocument,
    "query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}": typeof types.TeacherInfoDocument,
    "query AllTeachersSearch($teacherType: String!) {\n  teachers(teacherType: $teacherType) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}": typeof types.AllTeachersSearchDocument,
    "query Categories($levelId: Int, $subdisciplineId: Int) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}": typeof types.CategoriesDocument,
    "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": typeof types.ClassByNumberDocument,
    "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classType {\n      name\n      description\n    }\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    description\n    subdiscipline {\n      name\n      description\n    }\n    level {\n      name\n      description\n    }\n    category {\n      name\n      description\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": typeof types.FestivalClassSearchDocument,
    "query FestivalClasses($performerType: PerformerType) {\n  festivalClasses(performerType: $performerType) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}": typeof types.FestivalClassesDocument,
    "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}": typeof types.DisciplinesDocument,
    "query FieldConfig($fieldName: String!, $tableName: String!) {\n  fieldConfig(fieldName: $fieldName, tableName: $tableName) {\n    id\n    tableName\n    fieldName\n    customField\n    customFieldType\n    submissionRequired\n    __typename\n  }\n}": typeof types.FieldConfigDocument,
    "query FieldConfigs {\n  fieldConfigs {\n    tableName\n    fieldName\n    communityRequired\n    groupRequired\n    schoolRequired\n    soloRequired\n    customField\n    customFieldType\n  }\n}": typeof types.FieldConfigsDocument,
    "query instrument($instrumentId: Int, $instrumentName: String) {\n  instrument(id: $instrumentId, name: $instrumentName) {\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": typeof types.instrumentDocument,
    "query Instruments {\n  instruments {\n    id\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": typeof types.InstrumentsDocument,
    "query Item($itemId: Int!) {\n  item(id: $itemId) {\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}": typeof types.ItemDocument,
    "query Items {\n  items {\n    id\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}": typeof types.ItemsDocument,
    "query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}": typeof types.LevelsDocument,
    "query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}": typeof types.MyUserDocument,
    "query Order($orderId: Int!) {\n  order(orderID: $orderId) {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n  }\n}": typeof types.OrderDocument,
    "query Orders {\n  orders {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n    orderItems {\n      itemID\n      namesOnItems\n      notes\n      quantity\n      item {\n        id\n        name\n        description\n        startDate\n        endDate\n        price\n        notes\n        taxable\n        transferable\n      }\n    }\n  }\n}": typeof types.OrdersDocument,
    "query Registrations($performerType: PerformerType) {\n  registrations(performerType: $performerType) {\n    id\n    confirmation\n    label\n    payedAmt\n    performerType\n    submittedAt\n    teacher {\n      id\n    }\n    totalAmt\n    transactionInfo\n    createdAt\n    updatedAt\n  }\n}": typeof types.RegistrationsDocument,
    "query StudentRegistrations {\n  myStudents {\n    registrations {\n      confirmation\n      createdAt\n      id\n      label\n      performerType\n      submittedAt\n      updatedAt\n      performers {\n        firstName\n        lastName\n      }\n      group {\n        name\n      }\n      school {\n        name\n      }\n      community {\n        name\n      }\n    }\n  }\n}": typeof types.StudentRegistrationsDocument,
    "query SubDisciplines($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n  }\n}": typeof types.SubDisciplinesDocument,
    "query SubdisciplinesByType($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    performerType\n  }\n}": typeof types.SubdisciplinesByTypeDocument,
    "\n      query DoesTeacherExist($email: String!) {\n        checkUser(email: $email) {\n          id\n        }\n      }\n    ": typeof types.DoesTeacherExistDocument,
    "\n      query AdminRegistrations(\n        $performerType: PerformerType\n        $page: Int\n        $limit: Int\n        $sortField: String\n        $sortOrder: String\n        $searchFilters: RegistrationSearchFilters\n      ) {\n        registrations(\n          performerType: $performerType\n          page: $page\n          limit: $limit\n          sortField: $sortField\n          sortOrder: $sortOrder\n          searchFilters: $searchFilters\n        ) {\n          id\n          confirmation\n          label\n          payedAmt\n          performerType\n          submittedAt\n          teacher {\n            id\n          }\n          totalAmt\n          transactionInfo\n          createdAt\n          updatedAt\n        }\n      }\n    ": typeof types.AdminRegistrationsDocument,
    "\n      query PasswordChangeEmailVerification($email: String!) {\n        passwordChangeEmailVerification(email: $email) {\n          email\n        }\n      }\n    ": typeof types.PasswordChangeEmailVerificationDocument,
    "\n      mutation PasswordChange($passwordChangeInput: PasswordChangeInput!) {\n        passwordChange(passwordChangeInput: $passwordChangeInput) {\n          userErrors {\n            message\n          }\n          passwordChanged\n        }\n      }\n    ": typeof types.PasswordChangeDocument,
};
const documents: Documents = {
    "\n    query Logout {\n      logout\n    }\n  ": types.LogoutDocument,
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
    "mutation ItemCreate($itemInput: ItemInput!) {\n  itemCreate(ItemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.ItemCreateDocument,
    "mutation ItemDelete($itemDeleteId: Int!) {\n  itemDelete(id: $itemDeleteId) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.ItemDeleteDocument,
    "mutation ItemUpdate($itemUpdateId: Int!, $itemInput: ItemInput!) {\n  itemUpdate(id: $itemUpdateId, itemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.ItemUpdateDocument,
    "mutation OrderCreate($orderInput: OrderInput!) {\n  orderCreate(orderInput: $orderInput) {\n    order {\n      id\n      totalAmount\n      purchaseDate\n    }\n    userErrors {\n      message\n    }\n  }\n}": types.OrderCreateDocument,
    "mutation OrderDelete($orderId: Int!) {\n  orderDelete(orderID: $orderId) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.OrderDeleteDocument,
    "mutation OrderItemCreate($orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemCreate(orderID: $orderId, orderItemInput: $orderItemInput) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.OrderItemCreateDocument,
    "mutation OrderItemDelete($itemId: Int!, $orderId: Int!) {\n  orderItemDelete(itemID: $itemId, orderID: $orderId) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.OrderItemDeleteDocument,
    "mutation OrderItemUpdate($itemId: Int!, $orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemUpdate(\n    itemID: $itemId\n    orderID: $orderId\n    orderItemInput: $orderItemInput\n  ) {\n    orderItem {\n      itemID\n      orderID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.OrderItemUpdateDocument,
    "mutation OrderUpdate($orderId: Int!, $orderInput: OrderInput!) {\n  orderUpdate(orderID: $orderId, orderInput: $orderInput) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": types.OrderUpdateDocument,
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
    "query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}": types.CommunityGroupInfoDocument,
    "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      address\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}": types.CommunityInfoDocument,
    "query DisciplinesByType($performerType: PerformerType!) {\n  disciplines(performerType: $performerType) {\n    id\n    name\n    instruments {\n      id\n      name\n      mozart\n    }\n  }\n}": types.DisciplinesByTypeDocument,
    "query GroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    group {\n      id\n      age\n      groupType\n      instruments\n      name\n      numberOfPerformers\n    }\n  }\n}": types.GroupInfoDocument,
    "query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    pronouns\n    firstName\n    lastName\n    age\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n    otherClasses\n    unavailable\n    photoPermission\n  }\n}": types.PerformersDocument,
    "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      communityGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}": types.RegisteredClassesDocument,
    "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}": types.SchoolGroupInfoDocument,
    "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      address\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}": types.SchoolInfoDocument,
    "query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}": types.TeacherInfoDocument,
    "query AllTeachersSearch($teacherType: String!) {\n  teachers(teacherType: $teacherType) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}": types.AllTeachersSearchDocument,
    "query Categories($levelId: Int, $subdisciplineId: Int) {\n  categories(levelID: $levelId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n    requiredComposer\n  }\n}": types.CategoriesDocument,
    "query ClassByNumber($festivalClassNumber: String!) {\n  festivalClassByNumber(festivalClassNumber: $festivalClassNumber) {\n    id\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    category {\n      id\n      name\n      description\n      requiredComposer\n    }\n    level {\n      id\n      name\n      description\n    }\n    subdiscipline {\n      id\n      name\n      description\n      discipline {\n        id\n        name\n      }\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.ClassByNumberDocument,
    "query FestivalClassSearch($festivalClassSearch: FestivalClassSearchArgs!) {\n  festivalClassSearch(festivalClassSearch: $festivalClassSearch) {\n    id\n    classType {\n      name\n      description\n    }\n    classNumber\n    maxSelections\n    minSelections\n    requiredSelection\n    performerType\n    price\n    description\n    subdiscipline {\n      name\n      description\n    }\n    level {\n      name\n      description\n    }\n    category {\n      name\n      description\n    }\n    trophies {\n      id\n      name\n      description\n    }\n  }\n}": types.FestivalClassSearchDocument,
    "query FestivalClasses($performerType: PerformerType) {\n  festivalClasses(performerType: $performerType) {\n    subdiscipline {\n      id\n      name\n    }\n  }\n}": types.FestivalClassesDocument,
    "query Disciplines {\n  disciplines {\n    id\n    name\n  }\n}": types.DisciplinesDocument,
    "query FieldConfig($fieldName: String!, $tableName: String!) {\n  fieldConfig(fieldName: $fieldName, tableName: $tableName) {\n    id\n    tableName\n    fieldName\n    customField\n    customFieldType\n    submissionRequired\n    __typename\n  }\n}": types.FieldConfigDocument,
    "query FieldConfigs {\n  fieldConfigs {\n    tableName\n    fieldName\n    communityRequired\n    groupRequired\n    schoolRequired\n    soloRequired\n    customField\n    customFieldType\n  }\n}": types.FieldConfigsDocument,
    "query instrument($instrumentId: Int, $instrumentName: String) {\n  instrument(id: $instrumentId, name: $instrumentName) {\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": types.instrumentDocument,
    "query Instruments {\n  instruments {\n    id\n    name\n    mozart\n    discipline {\n      name\n    }\n  }\n}": types.InstrumentsDocument,
    "query Item($itemId: Int!) {\n  item(id: $itemId) {\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}": types.ItemDocument,
    "query Items {\n  items {\n    id\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}": types.ItemsDocument,
    "query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}": types.LevelsDocument,
    "query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}": types.MyUserDocument,
    "query Order($orderId: Int!) {\n  order(orderID: $orderId) {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n  }\n}": types.OrderDocument,
    "query Orders {\n  orders {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n    orderItems {\n      itemID\n      namesOnItems\n      notes\n      quantity\n      item {\n        id\n        name\n        description\n        startDate\n        endDate\n        price\n        notes\n        taxable\n        transferable\n      }\n    }\n  }\n}": types.OrdersDocument,
    "query Registrations($performerType: PerformerType) {\n  registrations(performerType: $performerType) {\n    id\n    confirmation\n    label\n    payedAmt\n    performerType\n    submittedAt\n    teacher {\n      id\n    }\n    totalAmt\n    transactionInfo\n    createdAt\n    updatedAt\n  }\n}": types.RegistrationsDocument,
    "query StudentRegistrations {\n  myStudents {\n    registrations {\n      confirmation\n      createdAt\n      id\n      label\n      performerType\n      submittedAt\n      updatedAt\n      performers {\n        firstName\n        lastName\n      }\n      group {\n        name\n      }\n      school {\n        name\n      }\n      community {\n        name\n      }\n    }\n  }\n}": types.StudentRegistrationsDocument,
    "query SubDisciplines($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n  }\n}": types.SubDisciplinesDocument,
    "query SubdisciplinesByType($disciplineId: Int!, $performerType: PerformerType!) {\n  subdisciplines(disciplineID: $disciplineId, performerType: $performerType) {\n    id\n    name\n    description\n    maxPerformers\n    minPerformers\n    performerType\n  }\n}": types.SubdisciplinesByTypeDocument,
    "\n      query DoesTeacherExist($email: String!) {\n        checkUser(email: $email) {\n          id\n        }\n      }\n    ": types.DoesTeacherExistDocument,
    "\n      query AdminRegistrations(\n        $performerType: PerformerType\n        $page: Int\n        $limit: Int\n        $sortField: String\n        $sortOrder: String\n        $searchFilters: RegistrationSearchFilters\n      ) {\n        registrations(\n          performerType: $performerType\n          page: $page\n          limit: $limit\n          sortField: $sortField\n          sortOrder: $sortOrder\n          searchFilters: $searchFilters\n        ) {\n          id\n          confirmation\n          label\n          payedAmt\n          performerType\n          submittedAt\n          teacher {\n            id\n          }\n          totalAmt\n          transactionInfo\n          createdAt\n          updatedAt\n        }\n      }\n    ": types.AdminRegistrationsDocument,
    "\n      query PasswordChangeEmailVerification($email: String!) {\n        passwordChangeEmailVerification(email: $email) {\n          email\n        }\n      }\n    ": types.PasswordChangeEmailVerificationDocument,
    "\n      mutation PasswordChange($passwordChangeInput: PasswordChangeInput!) {\n        passwordChange(passwordChangeInput: $passwordChangeInput) {\n          userErrors {\n            message\n          }\n          passwordChanged\n        }\n      }\n    ": types.PasswordChangeDocument,
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
export function graphql(source: "\n    query Logout {\n      logout\n    }\n  "): (typeof documents)["\n    query Logout {\n      logout\n    }\n  "];
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
export function graphql(source: "mutation ItemCreate($itemInput: ItemInput!) {\n  itemCreate(ItemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ItemCreate($itemInput: ItemInput!) {\n  itemCreate(ItemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ItemDelete($itemDeleteId: Int!) {\n  itemDelete(id: $itemDeleteId) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ItemDelete($itemDeleteId: Int!) {\n  itemDelete(id: $itemDeleteId) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ItemUpdate($itemUpdateId: Int!, $itemInput: ItemInput!) {\n  itemUpdate(id: $itemUpdateId, itemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ItemUpdate($itemUpdateId: Int!, $itemInput: ItemInput!) {\n  itemUpdate(id: $itemUpdateId, itemInput: $itemInput) {\n    item {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderCreate($orderInput: OrderInput!) {\n  orderCreate(orderInput: $orderInput) {\n    order {\n      id\n      totalAmount\n      purchaseDate\n    }\n    userErrors {\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderCreate($orderInput: OrderInput!) {\n  orderCreate(orderInput: $orderInput) {\n    order {\n      id\n      totalAmount\n      purchaseDate\n    }\n    userErrors {\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderDelete($orderId: Int!) {\n  orderDelete(orderID: $orderId) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderDelete($orderId: Int!) {\n  orderDelete(orderID: $orderId) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderItemCreate($orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemCreate(orderID: $orderId, orderItemInput: $orderItemInput) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderItemCreate($orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemCreate(orderID: $orderId, orderItemInput: $orderItemInput) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderItemDelete($itemId: Int!, $orderId: Int!) {\n  orderItemDelete(itemID: $itemId, orderID: $orderId) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderItemDelete($itemId: Int!, $orderId: Int!) {\n  orderItemDelete(itemID: $itemId, orderID: $orderId) {\n    orderItem {\n      orderID\n      itemID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderItemUpdate($itemId: Int!, $orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemUpdate(\n    itemID: $itemId\n    orderID: $orderId\n    orderItemInput: $orderItemInput\n  ) {\n    orderItem {\n      itemID\n      orderID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderItemUpdate($itemId: Int!, $orderId: Int!, $orderItemInput: OrderItemInput!) {\n  orderItemUpdate(\n    itemID: $itemId\n    orderID: $orderId\n    orderItemInput: $orderItemInput\n  ) {\n    orderItem {\n      itemID\n      orderID\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation OrderUpdate($orderId: Int!, $orderInput: OrderInput!) {\n  orderUpdate(orderID: $orderId, orderInput: $orderInput) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation OrderUpdate($orderId: Int!, $orderInput: OrderInput!) {\n  orderUpdate(orderID: $orderId, orderInput: $orderInput) {\n    order {\n      id\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}"];
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
export function graphql(source: "query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}"): (typeof documents)["query CommunityGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      communityGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      address\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"): (typeof documents)["query CommunityInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    community {\n      id\n      name\n      address\n      city\n      province\n      postalCode\n      phone\n      email\n    }\n  }\n}"];
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
export function graphql(source: "query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    pronouns\n    firstName\n    lastName\n    age\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n    otherClasses\n    unavailable\n    photoPermission\n  }\n}"): (typeof documents)["query Performers($registrationId: Int!) {\n  performers(registrationID: $registrationId) {\n    id\n    pronouns\n    firstName\n    lastName\n    age\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n    level\n    otherClasses\n    unavailable\n    photoPermission\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      communityGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"): (typeof documents)["query RegisteredClasses($registrationId: Int!) {\n  registration(id: $registrationId) {\n    registeredClasses {\n      category\n      classType\n      classNumber\n      discipline\n      id\n      level\n      minSelections\n      maxSelections\n      numberOfSelections\n      price\n      subdiscipline\n      schoolGroupID\n      communityGroupID\n      selections {\n        composer\n        duration\n        id\n        largerWork\n        movement\n        title\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}"): (typeof documents)["query SchoolGroupInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      schoolGroups {\n        id\n        name\n        groupSize\n        chaperones\n        wheelchairs\n        earliestTime\n        latestTime\n        unavailable\n        conflictPerformers\n        photoPermission\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      address\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}"): (typeof documents)["query SchoolInfo($registrationId: Int!) {\n  registration(id: $registrationId) {\n    school {\n      id\n      name\n      division\n      address\n      city\n      province\n      postalCode\n      phone\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}"): (typeof documents)["query TeacherInfo($teacherID: Int, $teacherEmail: String) {\n  teacher(teacherID: $teacherID, teacherEmail: $teacherEmail) {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    instrument\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AllTeachersSearch($teacherType: String!) {\n  teachers(teacherType: $teacherType) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}"): (typeof documents)["query AllTeachersSearch($teacherType: String!) {\n  teachers(teacherType: $teacherType) {\n    id\n    firstName\n    lastName\n    instrument\n  }\n}"];
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
export function graphql(source: "query Item($itemId: Int!) {\n  item(id: $itemId) {\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Item($itemId: Int!) {\n  item(id: $itemId) {\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Items {\n  items {\n    id\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Items {\n  items {\n    id\n    name\n    description\n    startDate\n    endDate\n    price\n    taxable\n    transferable\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"): (typeof documents)["query Levels($subdisciplineId: Int, $categoryId: Int) {\n  levels(categoryID: $categoryId, subdisciplineID: $subdisciplineId) {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}"): (typeof documents)["query MyUser {\n  myUser {\n    id\n    firstName\n    lastName\n    address\n    city\n    province\n    postalCode\n    phone\n    email\n    emailConfirmed\n    instrument\n    privateTeacher\n    schoolTeacher\n    hasSignedIn\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Order($orderId: Int!) {\n  order(orderID: $orderId) {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Order($orderId: Int!) {\n  order(orderID: $orderId) {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Orders {\n  orders {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n    orderItems {\n      itemID\n      namesOnItems\n      notes\n      quantity\n      item {\n        id\n        name\n        description\n        startDate\n        endDate\n        price\n        notes\n        taxable\n        transferable\n      }\n    }\n  }\n}"): (typeof documents)["query Orders {\n  orders {\n    id\n    totalAmount\n    payedAmount\n    purchaseDate\n    deliveryDate\n    methodDelivered\n    createdAt\n    updatedAt\n    orderItems {\n      itemID\n      namesOnItems\n      notes\n      quantity\n      item {\n        id\n        name\n        description\n        startDate\n        endDate\n        price\n        notes\n        taxable\n        transferable\n      }\n    }\n  }\n}"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DoesTeacherExist($email: String!) {\n        checkUser(email: $email) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      query DoesTeacherExist($email: String!) {\n        checkUser(email: $email) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminRegistrations(\n        $performerType: PerformerType\n        $page: Int\n        $limit: Int\n        $sortField: String\n        $sortOrder: String\n        $searchFilters: RegistrationSearchFilters\n      ) {\n        registrations(\n          performerType: $performerType\n          page: $page\n          limit: $limit\n          sortField: $sortField\n          sortOrder: $sortOrder\n          searchFilters: $searchFilters\n        ) {\n          id\n          confirmation\n          label\n          payedAmt\n          performerType\n          submittedAt\n          teacher {\n            id\n          }\n          totalAmt\n          transactionInfo\n          createdAt\n          updatedAt\n        }\n      }\n    "): (typeof documents)["\n      query AdminRegistrations(\n        $performerType: PerformerType\n        $page: Int\n        $limit: Int\n        $sortField: String\n        $sortOrder: String\n        $searchFilters: RegistrationSearchFilters\n      ) {\n        registrations(\n          performerType: $performerType\n          page: $page\n          limit: $limit\n          sortField: $sortField\n          sortOrder: $sortOrder\n          searchFilters: $searchFilters\n        ) {\n          id\n          confirmation\n          label\n          payedAmt\n          performerType\n          submittedAt\n          teacher {\n            id\n          }\n          totalAmt\n          transactionInfo\n          createdAt\n          updatedAt\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query PasswordChangeEmailVerification($email: String!) {\n        passwordChangeEmailVerification(email: $email) {\n          email\n        }\n      }\n    "): (typeof documents)["\n      query PasswordChangeEmailVerification($email: String!) {\n        passwordChangeEmailVerification(email: $email) {\n          email\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation PasswordChange($passwordChangeInput: PasswordChangeInput!) {\n        passwordChange(passwordChangeInput: $passwordChangeInput) {\n          userErrors {\n            message\n          }\n          passwordChanged\n        }\n      }\n    "): (typeof documents)["\n      mutation PasswordChange($passwordChangeInput: PasswordChangeInput!) {\n        passwordChange(passwordChangeInput: $passwordChangeInput) {\n          userErrors {\n            message\n          }\n          passwordChanged\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;