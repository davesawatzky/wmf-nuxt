export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string, output: string }
  String: { input: string, output: string }
  Boolean: { input: boolean, output: boolean }
  Int: { input: number, output: number }
  Float: { input: number, output: number }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: Date, output: Date }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: number, output: number }
}

export interface AuthPayload {
  __typename?: 'AuthPayload'
  diatonicToken?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
  userErrors: Array<UserError>
}

export interface Category {
  __typename?: 'Category'
  description?: Maybe<Scalars['String']['output']>
  festivalClasses?: Maybe<Array<FestivalClass>>
  id: Scalars['Int']['output']
  levels?: Maybe<Array<Level>>
  name: Scalars['String']['output']
  requiredComposer?: Maybe<Scalars['String']['output']>
  subdisciplines?: Maybe<Array<Subdiscipline>>
}

export interface CategoryfestivalClassesArgs {
  levelID: Scalars['Int']['input']
  performerType: PerformerType
  subdisciplineID: Scalars['Int']['input']
}

export interface CategoryInput {
  description?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
  requiredComposer?: InputMaybe<Scalars['String']['input']>
}

export interface CategoryPayload {
  __typename?: 'CategoryPayload'
  category?: Maybe<Category>
  userErrors: Array<UserError>
}

export interface ClassType {
  __typename?: 'ClassType'
  description?: Maybe<Scalars['String']['output']>
  festivalClasses: Array<FestivalClass>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
}

export interface ClassTypeInput {
  description?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
}

export interface ClassTypePayload {
  __typename?: 'ClassTypePayload'
  classType?: Maybe<ClassType>
  userErrors: Array<UserError>
}

export interface Community {
  __typename?: 'Community'
  address?: Maybe<Scalars['String']['output']>
  city?: Maybe<Scalars['String']['output']>
  communityGroups?: Maybe<Array<CommunityGroup>>
  email?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  name?: Maybe<Scalars['String']['output']>
  phone?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  province?: Maybe<Scalars['String']['output']>
  registration?: Maybe<Registration>
}

export interface CommunityGroup {
  __typename?: 'CommunityGroup'
  chaperones?: Maybe<Scalars['Int']['output']>
  community?: Maybe<Community>
  conflictPerformers?: Maybe<Scalars['String']['output']>
  earliestTime?: Maybe<Scalars['String']['output']>
  groupSize?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  latestTime?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  photoPermission?: Maybe<Scalars['String']['output']>
  unavailable?: Maybe<Scalars['String']['output']>
  wheelchairs?: Maybe<Scalars['Int']['output']>
}

export interface CommunityGroupInput {
  chaperones?: InputMaybe<Scalars['Int']['input']>
  conflictPerformers?: InputMaybe<Scalars['String']['input']>
  earliestTime?: InputMaybe<Scalars['String']['input']>
  groupSize?: InputMaybe<Scalars['Int']['input']>
  latestTime?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  photoPermission?: InputMaybe<Scalars['String']['input']>
  unavailable?: InputMaybe<Scalars['String']['input']>
  wheelchairs?: InputMaybe<Scalars['Int']['input']>
}

export interface CommunityGroupPayload {
  __typename?: 'CommunityGroupPayload'
  communityGroup?: Maybe<CommunityGroup>
  userErrors: Array<UserError>
}

export interface CommunityInput {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  province?: InputMaybe<Scalars['String']['input']>
}

export interface CommunityPayload {
  __typename?: 'CommunityPayload'
  community?: Maybe<Community>
  userErrors: Array<UserError>
}

export interface CredentialsSignin {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export interface CredentialsSignup {
  email: Scalars['String']['input']
  firstName: Scalars['String']['input']
  instrument?: InputMaybe<Scalars['String']['input']>
  isActive: Scalars['Boolean']['input']
  lastName: Scalars['String']['input']
  password: Scalars['String']['input']
  permissions?: InputMaybe<Array<Scalars['String']['input']>>
  privateTeacher: Scalars['Boolean']['input']
  roles: Array<Scalars['String']['input']>
  schoolTeacher: Scalars['Boolean']['input']
}

export interface Discipline {
  __typename?: 'Discipline'
  id: Scalars['Int']['output']
  instruments?: Maybe<Array<Instrument>>
  name: Scalars['String']['output']
  subdisciplines?: Maybe<Array<Subdiscipline>>
}

export interface DisciplinesubdisciplinesArgs {
  performerType?: InputMaybe<PerformerType>
}

export interface DisciplineInput {
  name: Scalars['String']['input']
}

export interface DisciplinePayload {
  __typename?: 'DisciplinePayload'
  discipline?: Maybe<Discipline>
  userErrors: Array<UserError>
}

export interface EmailExists {
  __typename?: 'EmailExists'
  email?: Maybe<Scalars['String']['output']>
}

export interface FestivalClass {
  __typename?: 'FestivalClass'
  category: Category
  classNumber: Scalars['String']['output']
  classType: ClassType
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  level: Level
  maxSelections: Scalars['Int']['output']
  minSelections: Scalars['Int']['output']
  performerType: PerformerType
  price?: Maybe<Scalars['Int']['output']>
  requiredSelection?: Maybe<Scalars['String']['output']>
  subdiscipline: Subdiscipline
  trophies?: Maybe<Array<Trophy>>
}

export interface FestivalClassInput {
  categoryID: Scalars['Int']['input']
  classNumber: Scalars['String']['input']
  classTypeID: Scalars['Int']['input']
  description: Scalars['String']['input']
  levelID: Scalars['Int']['input']
  maxSelections: Scalars['Int']['input']
  minSelections: Scalars['Int']['input']
  performerType: PerformerType
  price?: InputMaybe<Scalars['Int']['input']>
  requiredSelection?: InputMaybe<Scalars['String']['input']>
  subdisciplineID: Scalars['Int']['input']
}

export interface FestivalClassPayload {
  __typename?: 'FestivalClassPayload'
  festivalClass?: Maybe<FestivalClass>
  userErrors: Array<UserError>
}

export interface FestivalClassSearchArgs {
  categoryID?: InputMaybe<Scalars['Int']['input']>
  levelID?: InputMaybe<Scalars['Int']['input']>
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>
}

export interface FieldConfig {
  __typename?: 'FieldConfig'
  communityRequired: Scalars['Boolean']['output']
  customField: Scalars['Boolean']['output']
  customFieldType?: Maybe<Scalars['String']['output']>
  fieldName: Scalars['String']['output']
  groupRequired: Scalars['Boolean']['output']
  id: Scalars['Int']['output']
  schoolRequired: Scalars['Boolean']['output']
  soloRequired: Scalars['Boolean']['output']
  submissionRequired: Scalars['Boolean']['output']
  tableName: Scalars['String']['output']
}

export interface FieldConfigInput {
  communityRequired: Scalars['Boolean']['input']
  customField: Scalars['Boolean']['input']
  customFieldType?: InputMaybe<Scalars['String']['input']>
  fieldName: Scalars['String']['input']
  groupRequired: Scalars['Boolean']['input']
  schoolRequired: Scalars['Boolean']['input']
  soloRequired: Scalars['Boolean']['input']
  submissionRequired: Scalars['Boolean']['input']
  tableName: Scalars['String']['input']
}

export interface FieldConfigPayload {
  __typename?: 'FieldConfigPayload'
  fieldConfig?: Maybe<FieldConfig>
  userErrors: Array<UserError>
}

export interface Group {
  __typename?: 'Group'
  age?: Maybe<Scalars['Int']['output']>
  groupType?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  instruments?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  numberOfPerformers?: Maybe<Scalars['Int']['output']>
  registration?: Maybe<Registration>
}

export interface GroupInput {
  age?: InputMaybe<Scalars['Int']['input']>
  groupType?: InputMaybe<Scalars['String']['input']>
  instruments?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  numberOfPerformers?: InputMaybe<Scalars['Int']['input']>
}

export interface GroupPayload {
  __typename?: 'GroupPayload'
  group?: Maybe<Group>
  userErrors: Array<UserError>
}

export interface Instrument {
  __typename?: 'Instrument'
  discipline?: Maybe<Discipline>
  id: Scalars['Int']['output']
  mozart?: Maybe<Scalars['Boolean']['output']>
  name: Scalars['String']['output']
}

export interface InstrumentInput {
  disciplineID?: InputMaybe<Scalars['Int']['input']>
  mozart?: InputMaybe<Scalars['Boolean']['input']>
  name: Scalars['String']['input']
}

export interface InstrumentPayload {
  __typename?: 'InstrumentPayload'
  instrument?: Maybe<Instrument>
  userErrors: Array<UserError>
}

export interface Item {
  __typename?: 'Item'
  createdAt?: Maybe<Scalars['DateTime']['output']>
  description?: Maybe<Scalars['String']['output']>
  endDate?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['Int']['output']
  name?: Maybe<Scalars['String']['output']>
  notes?: Maybe<Scalars['String']['output']>
  orderItems?: Maybe<Array<OrderItem>>
  orders?: Maybe<Array<Order>>
  price?: Maybe<Scalars['Float']['output']>
  startDate?: Maybe<Scalars['DateTime']['output']>
  taxable?: Maybe<Scalars['Boolean']['output']>
  transferable?: Maybe<Scalars['Boolean']['output']>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export interface ItemInput {
  description?: InputMaybe<Scalars['String']['input']>
  endDate?: InputMaybe<Scalars['DateTime']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  startDate?: InputMaybe<Scalars['DateTime']['input']>
  taxable?: InputMaybe<Scalars['Boolean']['input']>
  transferable?: InputMaybe<Scalars['Boolean']['input']>
}

export interface ItemPayload {
  __typename?: 'ItemPayload'
  item?: Maybe<Item>
  userErrors: Array<UserError>
}

export interface Level {
  __typename?: 'Level'
  categories?: Maybe<Array<Category>>
  description?: Maybe<Scalars['String']['output']>
  festivalClasses?: Maybe<Array<FestivalClass>>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  sortOrder?: Maybe<Scalars['Int']['output']>
  subdisciplines?: Maybe<Array<Subdiscipline>>
}

export interface LevelfestivalClassesArgs {
  categoryID: Scalars['Int']['input']
  performerType: PerformerType
  subdisciplineID: Scalars['Int']['input']
}

export interface LevelInput {
  description?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
  sortOrder?: InputMaybe<Scalars['Int']['input']>
}

export interface LevelPayload {
  __typename?: 'LevelPayload'
  level?: Maybe<Level>
  userErrors: Array<UserError>
}

export interface Mutation {
  __typename?: 'Mutation'
  categoryCreate: CategoryPayload
  categoryDelete: CategoryPayload
  categoryUpdate: CategoryPayload
  classTypeCreate: ClassTypePayload
  classTypeDelete: ClassTypePayload
  classTypeUpdate: ClassTypePayload
  communityCreate: CommunityPayload
  communityDelete: CommunityPayload
  communityGroupCreate: CommunityGroupPayload
  communityGroupDelete: CommunityGroupPayload
  communityGroupUpdate: CommunityGroupPayload
  communityUpdate: CommunityPayload
  disciplineCreate: DisciplinePayload
  disciplineDelete: DisciplinePayload
  disciplineUpdate: DisciplinePayload
  festivalClassCreate: FestivalClassPayload
  festivalClassDelete: FestivalClassPayload
  festivalClassUpdate: FestivalClassPayload
  fieldConfigCreate: FieldConfigPayload
  fieldConfigDelete: FieldConfigPayload
  fieldConfigUpdate: FieldConfigPayload
  groupCreate: GroupPayload
  groupDelete: GroupPayload
  groupUpdate: GroupPayload
  instrumentCreate: InstrumentPayload
  instrumentDelete: InstrumentPayload
  instrumentUpdate: InstrumentPayload
  itemCreate: ItemPayload
  itemDelete: ItemPayload
  itemUpdate: ItemPayload
  levelCreate: LevelPayload
  levelDelete: LevelPayload
  levelUpdate: LevelPayload
  orderCreate: OrderPayload
  orderDelete: OrderPayload
  orderItemCreate: OrderItemPayload
  orderItemDelete: OrderItemPayload
  orderItemUpdate: OrderItemPayload
  orderUpdate: OrderPayload
  passwordChange: PasswordChangePayload
  performerCreate: PerformerPayload
  performerDelete: PerformerPayload
  performerUpdate: PerformerPayload
  registeredClassCreate: RegisteredClassPayload
  registeredClassDelete: RegisteredClassPayload
  registeredClassUpdate: RegisteredClassPayload
  registrationCreate: RegistrationPayload
  registrationDelete: RegistrationPayload
  registrationUpdate: RegistrationPayload
  schoolCreate: SchoolPayload
  schoolDelete: SchoolPayload
  schoolGroupCreate: SchoolGroupPayload
  schoolGroupDelete: SchoolGroupPayload
  schoolGroupUpdate: SchoolGroupPayload
  schoolUpdate: SchoolPayload
  selectionCreate: SelectionPayload
  selectionDelete: SelectionPayload
  selectionUpdate: SelectionPayload
  signin: AuthPayload
  signup: AuthPayload
  subdisciplineCreate: SubdisciplinePayload
  subdisciplineDelete: SubdisciplinePayload
  subdisciplineUpdate: SubdisciplinePayload
  teacherCreate: TeacherPayload
  teacherDelete: TeacherPayload
  teacherUpdate: TeacherPayload
  trophyCreate: TrophyPayload
  trophyDelete: TrophyPayload
  trophyUpdate: TrophyPayload
  userDelete: UserPayload
  userUpdate: UserPayload
}

export interface MutationcategoryCreateArgs {
  categoryInput: CategoryInput
}

export interface MutationcategoryDeleteArgs {
  categoryID: Scalars['Int']['input']
}

export interface MutationcategoryUpdateArgs {
  categoryID: Scalars['Int']['input']
  categoryInput: CategoryInput
}

export interface MutationclassTypeCreateArgs {
  classTypeInput: ClassTypeInput
}

export interface MutationclassTypeDeleteArgs {
  classTypeID: Scalars['Int']['input']
}

export interface MutationclassTypeUpdateArgs {
  classTypeID: Scalars['Int']['input']
  classTypeInput: ClassTypeInput
}

export interface MutationcommunityCreateArgs {
  communityInput?: InputMaybe<CommunityInput>
  registrationID: Scalars['Int']['input']
}

export interface MutationcommunityDeleteArgs {
  communityID: Scalars['Int']['input']
}

export interface MutationcommunityGroupCreateArgs {
  communityGroupInput?: InputMaybe<CommunityGroupInput>
  communityID: Scalars['Int']['input']
}

export interface MutationcommunityGroupDeleteArgs {
  communityGroupID: Scalars['Int']['input']
}

export interface MutationcommunityGroupUpdateArgs {
  communityGroupID: Scalars['Int']['input']
  communityGroupInput: CommunityGroupInput
}

export interface MutationcommunityUpdateArgs {
  communityID: Scalars['Int']['input']
  communityInput: CommunityInput
}

export interface MutationdisciplineCreateArgs {
  disciplineInput: DisciplineInput
}

export interface MutationdisciplineDeleteArgs {
  disciplineID: Scalars['Int']['input']
}

export interface MutationdisciplineUpdateArgs {
  disciplineID: Scalars['Int']['input']
  disciplineInput: DisciplineInput
}

export interface MutationfestivalClassCreateArgs {
  festivalClassInput: FestivalClassInput
}

export interface MutationfestivalClassDeleteArgs {
  festivalClassID: Scalars['Int']['input']
}

export interface MutationfestivalClassUpdateArgs {
  festivalClassID: Scalars['Int']['input']
  festivalClassInput: FestivalClassInput
}

export interface MutationfieldConfigCreateArgs {
  fieldConfigInput: FieldConfigInput
}

export interface MutationfieldConfigDeleteArgs {
  fieldConfigID: Scalars['Int']['input']
}

export interface MutationfieldConfigUpdateArgs {
  fieldConfigID: Scalars['Int']['input']
  fieldConfigInput: FieldConfigInput
}

export interface MutationgroupCreateArgs {
  registrationID: Scalars['Int']['input']
}

export interface MutationgroupDeleteArgs {
  groupID: Scalars['Int']['input']
}

export interface MutationgroupUpdateArgs {
  groupID: Scalars['Int']['input']
  groupInput: GroupInput
}

export interface MutationinstrumentCreateArgs {
  instrumentInput: InstrumentInput
}

export interface MutationinstrumentDeleteArgs {
  instrumentID: Scalars['Int']['input']
}

export interface MutationinstrumentUpdateArgs {
  instrumentID: Scalars['Int']['input']
  instrumentInput: InstrumentInput
}

export interface MutationitemCreateArgs {
  ItemInput: ItemInput
}

export interface MutationitemDeleteArgs {
  id: Scalars['Int']['input']
}

export interface MutationitemUpdateArgs {
  id: Scalars['Int']['input']
  itemInput: ItemInput
}

export interface MutationlevelCreateArgs {
  levelInput: LevelInput
}

export interface MutationlevelDeleteArgs {
  levelID: Scalars['Int']['input']
}

export interface MutationlevelUpdateArgs {
  levelID: Scalars['Int']['input']
  levelInput: LevelInput
}

export interface MutationorderCreateArgs {
  orderInput: OrderInput
}

export interface MutationorderDeleteArgs {
  orderID: Scalars['Int']['input']
}

export interface MutationorderItemCreateArgs {
  orderID: Scalars['Int']['input']
  orderItemInput: OrderItemInput
}

export interface MutationorderItemDeleteArgs {
  itemID: Scalars['Int']['input']
  orderID: Scalars['Int']['input']
}

export interface MutationorderItemUpdateArgs {
  itemID: Scalars['Int']['input']
  orderID: Scalars['Int']['input']
  orderItemInput: OrderItemInput
}

export interface MutationorderUpdateArgs {
  orderID: Scalars['Int']['input']
  orderInput: OrderInput
}

export interface MutationpasswordChangeArgs {
  passwordChangeInput: PasswordChangeInput
}

export interface MutationperformerCreateArgs {
  performerInput?: InputMaybe<PerformerInput>
  registrationID: Scalars['Int']['input']
}

export interface MutationperformerDeleteArgs {
  performerID: Scalars['Int']['input']
}

export interface MutationperformerUpdateArgs {
  performerID: Scalars['Int']['input']
  performerInput: PerformerInput
}

export interface MutationregisteredClassCreateArgs {
  registeredClass?: InputMaybe<RegisteredClassInput>
  registrationID: Scalars['Int']['input']
}

export interface MutationregisteredClassDeleteArgs {
  registeredClassID: Scalars['Int']['input']
}

export interface MutationregisteredClassUpdateArgs {
  registeredClassID: Scalars['Int']['input']
  registeredClassInput: RegisteredClassInput
}

export interface MutationregistrationCreateArgs {
  label: Scalars['String']['input']
  performerType: PerformerType
}

export interface MutationregistrationDeleteArgs {
  registrationID: Scalars['Int']['input']
}

export interface MutationregistrationUpdateArgs {
  registrationID: Scalars['Int']['input']
  registrationInput: RegistrationInput
}

export interface MutationschoolCreateArgs {
  registrationID: Scalars['Int']['input']
  schoolInput?: InputMaybe<SchoolInput>
}

export interface MutationschoolDeleteArgs {
  schoolID: Scalars['Int']['input']
}

export interface MutationschoolGroupCreateArgs {
  schoolGroupInput?: InputMaybe<SchoolGroupInput>
  schoolID: Scalars['Int']['input']
}

export interface MutationschoolGroupDeleteArgs {
  schoolGroupID: Scalars['Int']['input']
}

export interface MutationschoolGroupUpdateArgs {
  schoolGroupID: Scalars['Int']['input']
  schoolGroupInput: SchoolGroupInput
}

export interface MutationschoolUpdateArgs {
  schoolID: Scalars['Int']['input']
  schoolInput: SchoolInput
}

export interface MutationselectionCreateArgs {
  registeredClassID: Scalars['Int']['input']
}

export interface MutationselectionDeleteArgs {
  selectionID: Scalars['Int']['input']
}

export interface MutationselectionUpdateArgs {
  selectionID: Scalars['Int']['input']
  selectionInput: SelectionInput
}

export interface MutationsigninArgs {
  credentials: CredentialsSignin
}

export interface MutationsignupArgs {
  credentials: CredentialsSignup
}

export interface MutationsubdisciplineCreateArgs {
  subdisciplineInput: SubdisciplineInput
}

export interface MutationsubdisciplineDeleteArgs {
  subdisciplineID: Scalars['Int']['input']
}

export interface MutationsubdisciplineUpdateArgs {
  subdisciplineID: Scalars['Int']['input']
  subdisciplineInput: SubdisciplineInput
}

export interface MutationteacherCreateArgs {
  privateTeacher: Scalars['Boolean']['input']
  schoolTeacher: Scalars['Boolean']['input']
  teacherInput: TeacherInput
}

export interface MutationteacherDeleteArgs {
  teacherID: Scalars['Int']['input']
}

export interface MutationteacherUpdateArgs {
  teacherID: Scalars['Int']['input']
  teacherInput: TeacherInput
}

export interface MutationtrophyCreateArgs {
  trophyInput: TrophyInput
}

export interface MutationtrophyDeleteArgs {
  trophyID: Scalars['Int']['input']
}

export interface MutationtrophyUpdateArgs {
  trophyID: Scalars['Int']['input']
  trophyInput: TrophyInput
}

export interface MutationuserDeleteArgs {
  userID: Scalars['Int']['input']
}

export interface MutationuserUpdateArgs {
  userID: Scalars['Int']['input']
  userInput: UserInput
}

export interface Order {
  __typename?: 'Order'
  createdAt?: Maybe<Scalars['DateTime']['output']>
  deliveryDate?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['Int']['output']
  items?: Maybe<Array<Item>>
  methodDelivered?: Maybe<Scalars['String']['output']>
  orderItems?: Maybe<Array<OrderItem>>
  payedAmount?: Maybe<Scalars['Float']['output']>
  purchaseDate?: Maybe<Scalars['DateTime']['output']>
  totalAmount?: Maybe<Scalars['Float']['output']>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
  user?: Maybe<User>
}

export interface OrderInput {
  deliveryDate?: InputMaybe<Scalars['DateTime']['input']>
  methodDelivered?: InputMaybe<Scalars['String']['input']>
  payedAmount?: InputMaybe<Scalars['Float']['input']>
  purchaseDate?: InputMaybe<Scalars['DateTime']['input']>
  totalAmount?: InputMaybe<Scalars['Float']['input']>
}

export interface OrderItem {
  __typename?: 'OrderItem'
  createdAt?: Maybe<Scalars['DateTime']['output']>
  item?: Maybe<Item>
  itemID: Scalars['Int']['output']
  namesOnItems: Array<Scalars['String']['output']>
  notes?: Maybe<Scalars['String']['output']>
  order?: Maybe<Order>
  orderID: Scalars['Int']['output']
  quantity: Scalars['Int']['output']
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export interface OrderItemInput {
  itemID: Scalars['Int']['input']
  namesOnItems?: InputMaybe<Array<Scalars['String']['input']>>
  notes?: InputMaybe<Scalars['String']['input']>
  orderID: Scalars['Int']['input']
  quantity?: InputMaybe<Scalars['Int']['input']>
}

export interface OrderItemPayload {
  __typename?: 'OrderItemPayload'
  orderItem?: Maybe<OrderItem>
  userErrors: Array<UserError>
}

export interface OrderPayload {
  __typename?: 'OrderPayload'
  order?: Maybe<Order>
  userErrors: Array<UserError>
}

export interface PasswordChangeInput {
  password1: Scalars['String']['input']
  password2: Scalars['String']['input']
  resetToken: Scalars['String']['input']
}

export interface PasswordChangePayload {
  __typename?: 'PasswordChangePayload'
  passwordChanged: Scalars['Boolean']['output']
  userErrors: Array<UserError>
}

export interface PasswordExists {
  __typename?: 'PasswordExists'
  id: Scalars['Int']['output']
  pass: Scalars['Boolean']['output']
}

export interface Performer {
  __typename?: 'Performer'
  address?: Maybe<Scalars['String']['output']>
  age?: Maybe<Scalars['Int']['output']>
  city?: Maybe<Scalars['String']['output']>
  email?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  instrument?: Maybe<Scalars['String']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  level?: Maybe<Scalars['String']['output']>
  otherClasses?: Maybe<Scalars['String']['output']>
  phone?: Maybe<Scalars['String']['output']>
  photoPermission?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  pronouns?: Maybe<Scalars['String']['output']>
  province?: Maybe<Scalars['String']['output']>
  registration?: Maybe<Registration>
  unavailable?: Maybe<Scalars['String']['output']>
}

export interface PerformerInput {
  address?: InputMaybe<Scalars['String']['input']>
  age?: InputMaybe<Scalars['Int']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  instrument?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  level?: InputMaybe<Scalars['String']['input']>
  otherClasses?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  photoPermission?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  pronouns?: InputMaybe<Scalars['String']['input']>
  province?: InputMaybe<Scalars['String']['input']>
  unavailable?: InputMaybe<Scalars['String']['input']>
}

export interface PerformerPayload {
  __typename?: 'PerformerPayload'
  performer?: Maybe<Performer>
  userErrors: Array<UserError>
}

/** SOLO, GROUP, SCHOOL, COMMUNITY */
export enum PerformerType {
  COMMUNITY = 'COMMUNITY',
  GROUP = 'GROUP',
  SCHOOL = 'SCHOOL',
  SOLO = 'SOLO',
}

export interface Query {
  __typename?: 'Query'
  categories: Array<Category>
  category: Category
  checkIfPasswordExists: PasswordExists
  checkUser?: Maybe<User>
  classType: ClassType
  classTypes: Array<ClassType>
  communities: Array<Community>
  community: Community
  communityGroup: CommunityGroup
  communityGroups: Array<CommunityGroup>
  discipline: Discipline
  disciplines: Array<Discipline>
  festivalClass: FestivalClass
  festivalClassByNumber: FestivalClass
  festivalClassSearch: Array<FestivalClass>
  festivalClasses: Array<FestivalClass>
  fieldConfig: FieldConfig
  fieldConfigs: Array<FieldConfig>
  group: Group
  groups: Array<Group>
  instrument: Instrument
  instruments: Array<Instrument>
  item: Item
  items: Array<Item>
  level: Level
  levels: Array<Level>
  logout: Scalars['String']['output']
  myStudents: Teacher
  myUser: User
  order: Order
  orderItem: OrderItem
  orderItems: Array<OrderItem>
  orders: Array<Order>
  passwordChangeEmailVerification: EmailExists
  performer: Performer
  performers: Array<Performer>
  registeredClass: RegisteredClass
  registeredClasses: Array<RegisteredClass>
  registration: Registration
  registrations: Array<Registration>
  school: School
  schoolGroup: SchoolGroup
  schoolGroups: Array<SchoolGroup>
  schools: Array<School>
  selection: Selection
  selections: Array<Selection>
  subdiscipline: Subdiscipline
  subdisciplines: Array<Subdiscipline>
  teacher?: Maybe<Teacher>
  teachers: Array<Teacher>
  tokenCheck: TokenCheck
  trophies: Array<Trophy>
  trophy: Trophy
  user: User
  users: Array<User>
}

export interface QuerycategoriesArgs {
  levelID?: InputMaybe<Scalars['Int']['input']>
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>
}

export interface QuerycategoryArgs {
  id: Scalars['Int']['input']
}

export interface QuerycheckIfPasswordExistsArgs {
  id: Scalars['Int']['input']
}

export interface QuerycheckUserArgs {
  email: Scalars['String']['input']
}

export interface QueryclassTypeArgs {
  id: Scalars['Int']['input']
}

export interface QuerycommunityArgs {
  communityID?: InputMaybe<Scalars['Int']['input']>
  registrationID?: InputMaybe<Scalars['Int']['input']>
}

export interface QuerycommunityGroupArgs {
  communityGroupID: Scalars['Int']['input']
}

export interface QuerycommunityGroupsArgs {
  communityID?: InputMaybe<Scalars['Int']['input']>
}

export interface QuerydisciplineArgs {
  id: Scalars['Int']['input']
}

export interface QuerydisciplinesArgs {
  instrument?: InputMaybe<Scalars['String']['input']>
  performerType?: InputMaybe<PerformerType>
}

export interface QueryfestivalClassArgs {
  id: Scalars['Int']['input']
}

export interface QueryfestivalClassByNumberArgs {
  festivalClassNumber: Scalars['String']['input']
}

export interface QueryfestivalClassSearchArgs {
  festivalClassSearch: FestivalClassSearchArgs
}

export interface QueryfestivalClassesArgs {
  festivalClassSearch?: InputMaybe<FestivalClassSearchArgs>
  performerType?: InputMaybe<PerformerType>
}

export interface QueryfieldConfigArgs {
  fieldName: Scalars['String']['input']
  tableName: Scalars['String']['input']
}

export interface QuerygroupArgs {
  groupID?: InputMaybe<Scalars['Int']['input']>
  registrationID?: InputMaybe<Scalars['Int']['input']>
}

export interface QuerygroupsArgs {
  registrationID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryinstrumentArgs {
  id?: InputMaybe<Scalars['Int']['input']>
  name?: InputMaybe<Scalars['String']['input']>
}

export interface QueryinstrumentsArgs {
  disciplineID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryitemArgs {
  id: Scalars['Int']['input']
}

export interface QuerylevelArgs {
  id: Scalars['Int']['input']
}

export interface QuerylevelsArgs {
  categoryID?: InputMaybe<Scalars['Int']['input']>
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryorderArgs {
  orderID: Scalars['Int']['input']
}

export interface QueryorderItemArgs {
  itemID: Scalars['Int']['input']
  orderID: Scalars['Int']['input']
}

export interface QueryorderItemsArgs {
  orderID: Scalars['Int']['input']
}

export interface QuerypasswordChangeEmailVerificationArgs {
  email: Scalars['String']['input']
}

export interface QueryperformerArgs {
  performerID: Scalars['Int']['input']
}

export interface QueryperformersArgs {
  registrationID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryregisteredClassArgs {
  registeredClassID: Scalars['Int']['input']
}

export interface QueryregisteredClassesArgs {
  registrationID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryregistrationArgs {
  id: Scalars['Int']['input']
}

export interface QueryregistrationsArgs {
  performerType?: InputMaybe<PerformerType>
}

export interface QueryschoolArgs {
  registrationID?: InputMaybe<Scalars['Int']['input']>
  schoolID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryschoolGroupArgs {
  schoolGroupID: Scalars['Int']['input']
}

export interface QueryschoolGroupsArgs {
  schoolID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryselectionArgs {
  selectionID: Scalars['Int']['input']
}

export interface QueryselectionsArgs {
  registeredClassID?: InputMaybe<Scalars['Int']['input']>
}

export interface QuerysubdisciplineArgs {
  subdisciplineID: Scalars['Int']['input']
}

export interface QuerysubdisciplinesArgs {
  disciplineID?: InputMaybe<Scalars['Int']['input']>
  performerType?: InputMaybe<PerformerType>
}

export interface QueryteacherArgs {
  teacherEmail?: InputMaybe<Scalars['String']['input']>
  teacherID?: InputMaybe<Scalars['Int']['input']>
}

export interface QueryteachersArgs {
  teacherType: Scalars['String']['input']
}

export interface QuerytrophyArgs {
  id: Scalars['Int']['input']
}

export interface QueryuserArgs {
  email?: InputMaybe<Scalars['String']['input']>
  userID?: InputMaybe<Scalars['Int']['input']>
}

export interface RegisteredClass {
  __typename?: 'RegisteredClass'
  category?: Maybe<Scalars['String']['output']>
  classNumber?: Maybe<Scalars['String']['output']>
  classType?: Maybe<Scalars['String']['output']>
  communityGroupID?: Maybe<Scalars['Int']['output']>
  discipline?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  level?: Maybe<Scalars['String']['output']>
  maxSelections?: Maybe<Scalars['Int']['output']>
  minSelections?: Maybe<Scalars['Int']['output']>
  numberOfSelections?: Maybe<Scalars['Int']['output']>
  performers?: Maybe<Array<Performer>>
  price?: Maybe<Scalars['Decimal']['output']>
  regID?: Maybe<Scalars['Int']['output']>
  schoolGroupID?: Maybe<Scalars['Int']['output']>
  selections?: Maybe<Array<Selection>>
  subdiscipline?: Maybe<Scalars['String']['output']>
}

export interface RegisteredClassInput {
  category?: InputMaybe<Scalars['String']['input']>
  classNumber?: InputMaybe<Scalars['String']['input']>
  classType?: InputMaybe<Scalars['String']['input']>
  communityGroupID?: InputMaybe<Scalars['Int']['input']>
  discipline?: InputMaybe<Scalars['String']['input']>
  level?: InputMaybe<Scalars['String']['input']>
  maxSelections?: InputMaybe<Scalars['Int']['input']>
  minSelections?: InputMaybe<Scalars['Int']['input']>
  numberOfSelections?: InputMaybe<Scalars['Int']['input']>
  price?: InputMaybe<Scalars['Decimal']['input']>
  schoolGroupID?: InputMaybe<Scalars['Int']['input']>
  subdiscipline?: InputMaybe<Scalars['String']['input']>
}

export interface RegisteredClassPayload {
  __typename?: 'RegisteredClassPayload'
  registeredClass?: Maybe<RegisteredClass>
  userErrors: Array<UserError>
}

export interface Registration {
  __typename?: 'Registration'
  community?: Maybe<Community>
  confirmation?: Maybe<Scalars['String']['output']>
  createdAt?: Maybe<Scalars['DateTime']['output']>
  group?: Maybe<Group>
  id: Scalars['Int']['output']
  label?: Maybe<Scalars['String']['output']>
  payedAmt?: Maybe<Scalars['Float']['output']>
  performerType: PerformerType
  performers?: Maybe<Array<Performer>>
  registeredClasses?: Maybe<Array<RegisteredClass>>
  school?: Maybe<School>
  submittedAt?: Maybe<Scalars['DateTime']['output']>
  teacher?: Maybe<User>
  totalAmt?: Maybe<Scalars['Float']['output']>
  transactionInfo?: Maybe<Scalars['String']['output']>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
  user: User
}

export interface RegistrationInput {
  confirmation?: InputMaybe<Scalars['String']['input']>
  label?: InputMaybe<Scalars['String']['input']>
  payedAmt?: InputMaybe<Scalars['Float']['input']>
  performerType?: InputMaybe<PerformerType>
  submittedAt?: InputMaybe<Scalars['DateTime']['input']>
  teacherID?: InputMaybe<Scalars['Int']['input']>
  totalAmt?: InputMaybe<Scalars['Float']['input']>
  transactionInfo?: InputMaybe<Scalars['String']['input']>
}

export interface RegistrationPayload {
  __typename?: 'RegistrationPayload'
  registration?: Maybe<Registration>
  userErrors: Array<UserError>
}

export interface School {
  __typename?: 'School'
  address?: Maybe<Scalars['String']['output']>
  city?: Maybe<Scalars['String']['output']>
  division?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  name?: Maybe<Scalars['String']['output']>
  phone?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  province?: Maybe<Scalars['String']['output']>
  registration?: Maybe<Registration>
  schoolGroups?: Maybe<Array<SchoolGroup>>
}

export interface SchoolGroup {
  __typename?: 'SchoolGroup'
  chaperones?: Maybe<Scalars['Int']['output']>
  conflictPerformers?: Maybe<Scalars['String']['output']>
  earliestTime?: Maybe<Scalars['String']['output']>
  groupSize?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  latestTime?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  photoPermission?: Maybe<Scalars['String']['output']>
  school?: Maybe<School>
  unavailable?: Maybe<Scalars['String']['output']>
  wheelchairs?: Maybe<Scalars['Int']['output']>
}

export interface SchoolGroupInput {
  chaperones?: InputMaybe<Scalars['Int']['input']>
  conflictPerformers?: InputMaybe<Scalars['String']['input']>
  earliestTime?: InputMaybe<Scalars['String']['input']>
  groupSize?: InputMaybe<Scalars['Int']['input']>
  latestTime?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  photoPermission?: InputMaybe<Scalars['String']['input']>
  unavailable?: InputMaybe<Scalars['String']['input']>
  wheelchairs?: InputMaybe<Scalars['Int']['input']>
}

export interface SchoolGroupPayload {
  __typename?: 'SchoolGroupPayload'
  schoolGroup?: Maybe<SchoolGroup>
  userErrors: Array<UserError>
}

export interface SchoolInput {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  division?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  province?: InputMaybe<Scalars['String']['input']>
}

export interface SchoolPayload {
  __typename?: 'SchoolPayload'
  school?: Maybe<School>
  userErrors: Array<UserError>
}

export interface Selection {
  __typename?: 'Selection'
  composer?: Maybe<Scalars['String']['output']>
  duration?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  largerWork?: Maybe<Scalars['String']['output']>
  movement?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

export interface SelectionInput {
  composer?: InputMaybe<Scalars['String']['input']>
  duration?: InputMaybe<Scalars['String']['input']>
  largerWork?: InputMaybe<Scalars['String']['input']>
  movement?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

export interface SelectionPayload {
  __typename?: 'SelectionPayload'
  selection: Selection
  userErrors: Array<UserError>
}

export interface Subdiscipline {
  __typename?: 'Subdiscipline'
  categories?: Maybe<Array<Category>>
  description?: Maybe<Scalars['String']['output']>
  discipline?: Maybe<Discipline>
  festivalClasses?: Maybe<Array<FestivalClass>>
  id: Scalars['Int']['output']
  levels?: Maybe<Array<Level>>
  maxPerformers?: Maybe<Scalars['Int']['output']>
  minPerformers?: Maybe<Scalars['Int']['output']>
  name: Scalars['String']['output']
  performerType?: Maybe<PerformerType>
  price?: Maybe<Scalars['Decimal']['output']>
}

export interface SubdisciplinefestivalClassesArgs {
  categoryID?: InputMaybe<Scalars['Int']['input']>
  levelID?: InputMaybe<Scalars['Int']['input']>
  performerType?: InputMaybe<PerformerType>
}

export interface SubdisciplineInput {
  description?: InputMaybe<Scalars['String']['input']>
  disciplineID: Scalars['Int']['input']
  maxPerformers?: InputMaybe<Scalars['Int']['input']>
  minPerformers?: InputMaybe<Scalars['Int']['input']>
  name: Scalars['String']['input']
  performerType: PerformerType
  price?: InputMaybe<Scalars['Decimal']['input']>
}

export interface SubdisciplinePayload {
  __typename?: 'SubdisciplinePayload'
  subdiscipline?: Maybe<Subdiscipline>
  userErrors: Array<UserError>
}

export interface Submission {
  __typename?: 'Submission'
  confirmation: Scalars['String']['output']
  payedAmt?: Maybe<Scalars['Decimal']['output']>
  submittedAt: Scalars['DateTime']['output']
}

export interface Teacher {
  __typename?: 'Teacher'
  address?: Maybe<Scalars['String']['output']>
  city?: Maybe<Scalars['String']['output']>
  email?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  instrument?: Maybe<Scalars['String']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  phone?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  privateTeacher?: Maybe<Scalars['Boolean']['output']>
  province?: Maybe<Scalars['String']['output']>
  registrations?: Maybe<Array<Registration>>
  schoolTeacher?: Maybe<Scalars['Boolean']['output']>
}

export interface TeacherInput {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  instrument?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  privateTeacher?: InputMaybe<Scalars['Boolean']['input']>
  province?: InputMaybe<Scalars['String']['input']>
  schoolTeacher?: InputMaybe<Scalars['Boolean']['input']>
}

export interface TeacherPayload {
  __typename?: 'TeacherPayload'
  teacher?: Maybe<Teacher>
  userErrors: Array<UserError>
}

export interface TokenCheck {
  __typename?: 'TokenCheck'
  user?: Maybe<User>
  userErrors: Array<UserError>
}

export interface Trophy {
  __typename?: 'Trophy'
  description?: Maybe<Scalars['String']['output']>
  festivalClasses?: Maybe<Array<FestivalClass>>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
}

export interface TrophyInput {
  description?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
}

export interface TrophyPayload {
  __typename?: 'TrophyPayload'
  trophy?: Maybe<Trophy>
  userErrors: Array<UserError>
}

export interface User {
  __typename?: 'User'
  address?: Maybe<Scalars['String']['output']>
  city?: Maybe<Scalars['String']['output']>
  email?: Maybe<Scalars['String']['output']>
  emailConfirmed?: Maybe<Scalars['Boolean']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  instrument?: Maybe<Scalars['String']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  orders?: Maybe<Array<Order>>
  permissions?: Maybe<Array<Scalars['String']['output']>>
  phone?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  privateTeacher?: Maybe<Scalars['Boolean']['output']>
  province?: Maybe<Scalars['String']['output']>
  registrations?: Maybe<Array<Registration>>
  roles?: Maybe<Array<Scalars['String']['output']>>
  schoolTeacher?: Maybe<Scalars['Boolean']['output']>
}

export interface UserError {
  __typename?: 'UserError'
  field: Array<Scalars['String']['output']>
  message: Scalars['String']['output']
}

export interface UserInput {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  emailConfirmed?: InputMaybe<Scalars['Boolean']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  instrument?: InputMaybe<Scalars['String']['input']>
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  permissions?: InputMaybe<Array<Scalars['String']['input']>>
  phone?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  privateTeacher?: InputMaybe<Scalars['Boolean']['input']>
  province?: InputMaybe<Scalars['String']['input']>
  roles?: InputMaybe<Array<Scalars['String']['input']>>
  schoolTeacher?: InputMaybe<Scalars['Boolean']['input']>
}

export interface UserPayload {
  __typename?: 'UserPayload'
  user?: Maybe<User>
  userErrors: Array<UserError>
}
