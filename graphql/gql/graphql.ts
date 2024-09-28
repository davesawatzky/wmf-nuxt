/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  diatonicToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userErrors: Array<UserError>;
};

export type Category = {
  __typename: 'Category';
  description?: Maybe<Scalars['String']['output']>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int']['output'];
  levels?: Maybe<Array<Level>>;
  name: Scalars['String']['output'];
  requiredComposer?: Maybe<Scalars['String']['output']>;
  subdisciplines?: Maybe<Array<Subdiscipline>>;
};


export type CategoryfestivalClassesArgs = {
  levelID: Scalars['Int']['input'];
  performerType: PerformerType;
  subdisciplineID: Scalars['Int']['input'];
};

export type CategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  requiredComposer?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryPayload = {
  __typename: 'CategoryPayload';
  category?: Maybe<Category>;
  userErrors: Array<UserError>;
};

export type ClassType = {
  __typename: 'ClassType';
  description?: Maybe<Scalars['String']['output']>;
  festivalClasses: Array<FestivalClass>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ClassTypeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ClassTypePayload = {
  __typename: 'ClassTypePayload';
  classType?: Maybe<ClassType>;
  userErrors: Array<UserError>;
};

export type Community = {
  __typename: 'Community';
  city?: Maybe<Scalars['String']['output']>;
  communityGroups?: Maybe<Array<CommunityGroup>>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Registration>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
};

export type CommunityGroup = {
  __typename: 'CommunityGroup';
  chaperones?: Maybe<Scalars['Int']['output']>;
  community?: Maybe<Community>;
  conflictPerformers?: Maybe<Scalars['String']['output']>;
  earliestTime?: Maybe<Scalars['String']['output']>;
  groupSize?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  latestTime?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  photoPermission?: Maybe<Scalars['Boolean']['output']>;
  unavailable?: Maybe<Scalars['String']['output']>;
  wheelchairs?: Maybe<Scalars['Int']['output']>;
};

export type CommunityGroupInput = {
  chaperones?: InputMaybe<Scalars['Int']['input']>;
  conflictPerformers?: InputMaybe<Scalars['String']['input']>;
  earliestTime?: InputMaybe<Scalars['String']['input']>;
  groupSize?: InputMaybe<Scalars['Int']['input']>;
  latestTime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photoPermission?: InputMaybe<Scalars['Boolean']['input']>;
  unavailable?: InputMaybe<Scalars['String']['input']>;
  wheelchairs?: InputMaybe<Scalars['Int']['input']>;
};

export type CommunityGroupPayload = {
  __typename: 'CommunityGroupPayload';
  communityGroup?: Maybe<CommunityGroup>;
  userErrors: Array<UserError>;
};

export type CommunityInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CommunityPayload = {
  __typename: 'CommunityPayload';
  community?: Maybe<Community>;
  userErrors: Array<UserError>;
};

export type CredentialsSignin = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CredentialsSignup = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  instrument?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  privateTeacher: Scalars['Boolean']['input'];
  schoolTeacher: Scalars['Boolean']['input'];
};

export type Discipline = {
  __typename: 'Discipline';
  id: Scalars['Int']['output'];
  instruments?: Maybe<Array<Instrument>>;
  name: Scalars['String']['output'];
  subdisciplines?: Maybe<Array<Subdiscipline>>;
};


export type DisciplinesubdisciplinesArgs = {
  performerType?: InputMaybe<PerformerType>;
};

export type DisciplineInput = {
  name: Scalars['String']['input'];
};

export type DisciplinePayload = {
  __typename: 'DisciplinePayload';
  discipline?: Maybe<Discipline>;
  userErrors: Array<UserError>;
};

export type EmailExists = {
  __typename: 'EmailExists';
  email?: Maybe<Scalars['String']['output']>;
};

export type FestivalClass = {
  __typename: 'FestivalClass';
  category: Category;
  classNumber: Scalars['String']['output'];
  classType: ClassType;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  level: Level;
  maxSelections: Scalars['Int']['output'];
  minSelections: Scalars['Int']['output'];
  performerType: PerformerType;
  price?: Maybe<Scalars['Int']['output']>;
  requiredSelection?: Maybe<Scalars['String']['output']>;
  subdiscipline: Subdiscipline;
  trophies?: Maybe<Array<Trophy>>;
};

export type FestivalClassInput = {
  categoryID: Scalars['Int']['input'];
  classNumber: Scalars['String']['input'];
  classTypeID: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  levelID: Scalars['Int']['input'];
  maxSelections: Scalars['Int']['input'];
  minSelections: Scalars['Int']['input'];
  performerType: PerformerType;
  price?: InputMaybe<Scalars['Int']['input']>;
  requiredSelection?: InputMaybe<Scalars['String']['input']>;
  subdisciplineID: Scalars['Int']['input'];
};

export type FestivalClassPayload = {
  __typename: 'FestivalClassPayload';
  festivalClass?: Maybe<FestivalClass>;
  userErrors: Array<UserError>;
};

export type FestivalClassSearchArgs = {
  categoryID?: InputMaybe<Scalars['Int']['input']>;
  levelID?: InputMaybe<Scalars['Int']['input']>;
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>;
};

export type FieldConfig = {
  __typename: 'FieldConfig';
  communityRequired: Scalars['Boolean']['output'];
  customField: Scalars['Boolean']['output'];
  customFieldType?: Maybe<Scalars['String']['output']>;
  fieldName: Scalars['String']['output'];
  groupRequired: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  schoolRequired: Scalars['Boolean']['output'];
  soloRequired: Scalars['Boolean']['output'];
  submissionRequired: Scalars['Boolean']['output'];
  tableName: Scalars['String']['output'];
};

export type Group = {
  __typename: 'Group';
  age?: Maybe<Scalars['Int']['output']>;
  groupType?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  instruments?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  numberOfPerformers?: Maybe<Scalars['Int']['output']>;
  registration?: Maybe<Registration>;
};

export type GroupInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  groupType?: InputMaybe<Scalars['String']['input']>;
  instruments?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  numberOfPerformers?: InputMaybe<Scalars['Int']['input']>;
};

export type GroupPayload = {
  __typename: 'GroupPayload';
  group?: Maybe<Group>;
  userErrors: Array<UserError>;
};

export type Instrument = {
  __typename: 'Instrument';
  discipline?: Maybe<Discipline>;
  id: Scalars['Int']['output'];
  mozart?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type InstrumentInput = {
  disciplineID?: InputMaybe<Scalars['Int']['input']>;
  mozart?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type InstrumentPayload = {
  __typename: 'InstrumentPayload';
  instrument?: Maybe<Instrument>;
  userErrors: Array<UserError>;
};

export type Item = {
  __typename: 'Item';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderItems?: Maybe<Array<OrderItem>>;
  orders?: Maybe<Array<Order>>;
  price?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  taxable?: Maybe<Scalars['Boolean']['output']>;
  transferable?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  taxable?: InputMaybe<Scalars['Boolean']['input']>;
  transferable?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemPayload = {
  __typename: 'ItemPayload';
  item?: Maybe<Item>;
  userErrors: Array<UserError>;
};

export type Level = {
  __typename: 'Level';
  categories?: Maybe<Array<Category>>;
  description?: Maybe<Scalars['String']['output']>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  subdisciplines?: Maybe<Array<Subdiscipline>>;
};


export type LevelfestivalClassesArgs = {
  categoryID: Scalars['Int']['input'];
  performerType: PerformerType;
  subdisciplineID: Scalars['Int']['input'];
};

export type LevelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type LevelPayload = {
  __typename: 'LevelPayload';
  level?: Maybe<Level>;
  userErrors: Array<UserError>;
};

export type Mutation = {
  __typename: 'Mutation';
  categoryCreate: CategoryPayload;
  categoryDelete: CategoryPayload;
  categoryUpdate: CategoryPayload;
  classTypeCreate: ClassTypePayload;
  classTypeDelete: ClassTypePayload;
  classTypeUpdate: ClassTypePayload;
  communityCreate: CommunityPayload;
  communityDelete: CommunityPayload;
  communityGroupCreate: CommunityGroupPayload;
  communityGroupDelete: CommunityGroupPayload;
  communityGroupUpdate: CommunityGroupPayload;
  communityUpdate: CommunityPayload;
  disciplineCreate: DisciplinePayload;
  disciplineDelete: DisciplinePayload;
  disciplineUpdate: DisciplinePayload;
  festivalClassCreate: FestivalClassPayload;
  festivalClassDelete: FestivalClassPayload;
  festivalClassUpdate: FestivalClassPayload;
  groupCreate: GroupPayload;
  groupDelete: GroupPayload;
  groupUpdate: GroupPayload;
  instrumentCreate: InstrumentPayload;
  instrumentDelete: InstrumentPayload;
  instrumentUpdate: InstrumentPayload;
  itemCreate: ItemPayload;
  itemDelete: ItemPayload;
  itemUpdate: ItemPayload;
  levelCreate: LevelPayload;
  levelDelete: LevelPayload;
  levelUpdate: LevelPayload;
  orderCreate: OrderPayload;
  orderDelete: OrderPayload;
  orderItemCreate: OrderItemPayload;
  orderItemDelete: OrderItemPayload;
  orderItemUpdate: OrderItemPayload;
  orderUpdate: OrderPayload;
  passwordChange: PasswordChangePayload;
  performerCreate: PerformerPayload;
  performerDelete: PerformerPayload;
  performerUpdate: PerformerPayload;
  registeredClassCreate: RegisteredClassPayload;
  registeredClassDelete: RegisteredClassPayload;
  registeredClassUpdate: RegisteredClassPayload;
  registrationCreate: RegistrationPayload;
  registrationDelete: RegistrationPayload;
  registrationUpdate: RegistrationPayload;
  schoolCreate: SchoolPayload;
  schoolDelete: SchoolPayload;
  schoolGroupCreate: SchoolGroupPayload;
  schoolGroupDelete: SchoolGroupPayload;
  schoolGroupUpdate: SchoolGroupPayload;
  schoolUpdate: SchoolPayload;
  selectionCreate: SelectionPayload;
  selectionDelete: SelectionPayload;
  selectionUpdate: SelectionPayload;
  signin: AuthPayload;
  signup: AuthPayload;
  subdisciplineCreate: SubdisciplinePayload;
  subdisciplineDelete: SubdisciplinePayload;
  subdisciplineUpdate: SubdisciplinePayload;
  teacherCreate: TeacherPayload;
  teacherDelete: TeacherPayload;
  teacherUpdate: TeacherPayload;
  trophyCreate: TrophyPayload;
  trophyDelete: TrophyPayload;
  trophyUpdate: TrophyPayload;
  userDelete: UserPayload;
  userUpdate: UserPayload;
};


export type MutationcategoryCreateArgs = {
  categoryInput: CategoryInput;
};


export type MutationcategoryDeleteArgs = {
  categoryID: Scalars['Int']['input'];
};


export type MutationcategoryUpdateArgs = {
  categoryID: Scalars['Int']['input'];
  categoryInput: CategoryInput;
};


export type MutationclassTypeCreateArgs = {
  classTypeInput: ClassTypeInput;
};


export type MutationclassTypeDeleteArgs = {
  classTypeID: Scalars['Int']['input'];
};


export type MutationclassTypeUpdateArgs = {
  classTypeID: Scalars['Int']['input'];
  classTypeInput: ClassTypeInput;
};


export type MutationcommunityCreateArgs = {
  communityInput?: InputMaybe<CommunityInput>;
  registrationID: Scalars['Int']['input'];
};


export type MutationcommunityDeleteArgs = {
  communityID: Scalars['Int']['input'];
};


export type MutationcommunityGroupCreateArgs = {
  communityGroupInput?: InputMaybe<CommunityGroupInput>;
  communityID: Scalars['Int']['input'];
};


export type MutationcommunityGroupDeleteArgs = {
  communityGroupID: Scalars['Int']['input'];
};


export type MutationcommunityGroupUpdateArgs = {
  communityGroupID: Scalars['Int']['input'];
  communityGroupInput: CommunityGroupInput;
};


export type MutationcommunityUpdateArgs = {
  communityID: Scalars['Int']['input'];
  communityInput: CommunityInput;
};


export type MutationdisciplineCreateArgs = {
  disciplineInput: DisciplineInput;
};


export type MutationdisciplineDeleteArgs = {
  disciplineID: Scalars['Int']['input'];
};


export type MutationdisciplineUpdateArgs = {
  disciplineID: Scalars['Int']['input'];
  disciplineInput: DisciplineInput;
};


export type MutationfestivalClassCreateArgs = {
  festivalClassInput: FestivalClassInput;
};


export type MutationfestivalClassDeleteArgs = {
  festivalClassID: Scalars['Int']['input'];
};


export type MutationfestivalClassUpdateArgs = {
  festivalClassID: Scalars['Int']['input'];
  festivalClassInput: FestivalClassInput;
};


export type MutationgroupCreateArgs = {
  registrationID: Scalars['Int']['input'];
};


export type MutationgroupDeleteArgs = {
  groupID: Scalars['Int']['input'];
};


export type MutationgroupUpdateArgs = {
  groupID: Scalars['Int']['input'];
  groupInput: GroupInput;
};


export type MutationinstrumentCreateArgs = {
  instrumentInput: InstrumentInput;
};


export type MutationinstrumentDeleteArgs = {
  instrumentID: Scalars['Int']['input'];
};


export type MutationinstrumentUpdateArgs = {
  instrumentID: Scalars['Int']['input'];
  instrumentInput: InstrumentInput;
};


export type MutationitemCreateArgs = {
  ItemInput: ItemInput;
};


export type MutationitemDeleteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationitemUpdateArgs = {
  id: Scalars['Int']['input'];
  itemInput: ItemInput;
};


export type MutationlevelCreateArgs = {
  levelInput: LevelInput;
};


export type MutationlevelDeleteArgs = {
  levelID: Scalars['Int']['input'];
};


export type MutationlevelUpdateArgs = {
  levelID: Scalars['Int']['input'];
  levelInput: LevelInput;
};


export type MutationorderCreateArgs = {
  orderInput: OrderInput;
};


export type MutationorderDeleteArgs = {
  orderID: Scalars['Int']['input'];
};


export type MutationorderItemCreateArgs = {
  orderID: Scalars['Int']['input'];
  orderItemInput: OrderItemInput;
};


export type MutationorderItemDeleteArgs = {
  itemID: Scalars['Int']['input'];
  orderID: Scalars['Int']['input'];
};


export type MutationorderItemUpdateArgs = {
  itemID: Scalars['Int']['input'];
  orderID: Scalars['Int']['input'];
  orderItemInput: OrderItemInput;
};


export type MutationorderUpdateArgs = {
  orderID: Scalars['Int']['input'];
  orderInput: OrderInput;
};


export type MutationpasswordChangeArgs = {
  passwordChangeInput: PasswordChangeInput;
};


export type MutationperformerCreateArgs = {
  performerInput?: InputMaybe<PerformerInput>;
  registrationID: Scalars['Int']['input'];
};


export type MutationperformerDeleteArgs = {
  performerID: Scalars['Int']['input'];
};


export type MutationperformerUpdateArgs = {
  performerID: Scalars['Int']['input'];
  performerInput: PerformerInput;
};


export type MutationregisteredClassCreateArgs = {
  registeredClass?: InputMaybe<RegisteredClassInput>;
  registrationID: Scalars['Int']['input'];
};


export type MutationregisteredClassDeleteArgs = {
  registeredClassID: Scalars['Int']['input'];
};


export type MutationregisteredClassUpdateArgs = {
  registeredClassID: Scalars['Int']['input'];
  registeredClassInput: RegisteredClassInput;
};


export type MutationregistrationCreateArgs = {
  label: Scalars['String']['input'];
  performerType: PerformerType;
};


export type MutationregistrationDeleteArgs = {
  registrationID: Scalars['Int']['input'];
};


export type MutationregistrationUpdateArgs = {
  registrationID: Scalars['Int']['input'];
  registrationInput: RegistrationInput;
};


export type MutationschoolCreateArgs = {
  registrationID: Scalars['Int']['input'];
  schoolInput?: InputMaybe<SchoolInput>;
};


export type MutationschoolDeleteArgs = {
  schoolID: Scalars['Int']['input'];
};


export type MutationschoolGroupCreateArgs = {
  schoolGroupInput?: InputMaybe<SchoolGroupInput>;
  schoolID: Scalars['Int']['input'];
};


export type MutationschoolGroupDeleteArgs = {
  schoolGroupID: Scalars['Int']['input'];
};


export type MutationschoolGroupUpdateArgs = {
  schoolGroupID: Scalars['Int']['input'];
  schoolGroupInput: SchoolGroupInput;
};


export type MutationschoolUpdateArgs = {
  schoolID: Scalars['Int']['input'];
  schoolInput: SchoolInput;
};


export type MutationselectionCreateArgs = {
  registeredClassID: Scalars['Int']['input'];
};


export type MutationselectionDeleteArgs = {
  selectionID: Scalars['Int']['input'];
};


export type MutationselectionUpdateArgs = {
  selectionID: Scalars['Int']['input'];
  selectionInput: SelectionInput;
};


export type MutationsigninArgs = {
  credentials: CredentialsSignin;
};


export type MutationsignupArgs = {
  credentials: CredentialsSignup;
};


export type MutationsubdisciplineCreateArgs = {
  subdisciplineInput: SubdisciplineInput;
};


export type MutationsubdisciplineDeleteArgs = {
  subdisciplineID: Scalars['Int']['input'];
};


export type MutationsubdisciplineUpdateArgs = {
  subdisciplineID: Scalars['Int']['input'];
  subdisciplineInput: SubdisciplineInput;
};


export type MutationteacherCreateArgs = {
  privateTeacher: Scalars['Boolean']['input'];
  schoolTeacher: Scalars['Boolean']['input'];
  teacherInput: TeacherInput;
};


export type MutationteacherDeleteArgs = {
  teacherID: Scalars['Int']['input'];
};


export type MutationteacherUpdateArgs = {
  teacherID: Scalars['Int']['input'];
  teacherInput: TeacherInput;
};


export type MutationtrophyCreateArgs = {
  trophyInput: TrophyInput;
};


export type MutationtrophyDeleteArgs = {
  trophyID: Scalars['Int']['input'];
};


export type MutationtrophyUpdateArgs = {
  trophyID: Scalars['Int']['input'];
  trophyInput: TrophyInput;
};


export type MutationuserDeleteArgs = {
  userID: Scalars['Int']['input'];
};


export type MutationuserUpdateArgs = {
  userID: Scalars['Int']['input'];
  userInput: UserInput;
};

export type Order = {
  __typename: 'Order';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deliveryDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  items?: Maybe<Array<Item>>;
  methodDelivered?: Maybe<Scalars['String']['output']>;
  orderItems?: Maybe<Array<OrderItem>>;
  payedAmount?: Maybe<Scalars['Float']['output']>;
  purchaseDate?: Maybe<Scalars['DateTime']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

export type OrderInput = {
  deliveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  methodDelivered?: InputMaybe<Scalars['String']['input']>;
  payedAmount?: InputMaybe<Scalars['Float']['input']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type OrderItem = {
  __typename: 'OrderItem';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  item?: Maybe<Item>;
  itemID: Scalars['Int']['output'];
  namesOnItems: Array<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Order>;
  orderID: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderItemInput = {
  itemID: Scalars['Int']['input'];
  namesOnItems?: InputMaybe<Array<Scalars['String']['input']>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  orderID: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderItemPayload = {
  __typename: 'OrderItemPayload';
  orderItem?: Maybe<OrderItem>;
  userErrors: Array<UserError>;
};

export type OrderPayload = {
  __typename: 'OrderPayload';
  order?: Maybe<Order>;
  userErrors: Array<UserError>;
};

export type PasswordChangeInput = {
  password1: Scalars['String']['input'];
  password2: Scalars['String']['input'];
  resetToken: Scalars['String']['input'];
};

export type PasswordChangePayload = {
  __typename: 'PasswordChangePayload';
  passwordChanged: Scalars['Boolean']['output'];
  userErrors: Array<UserError>;
};

export type PasswordExists = {
  __typename: 'PasswordExists';
  id: Scalars['Int']['output'];
  pass: Scalars['Boolean']['output'];
};

export type Performer = {
  __typename: 'Performer';
  age?: Maybe<Scalars['Int']['output']>;
  apartment?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  instrument?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  otherClasses?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  photoPermission?: Maybe<Scalars['Boolean']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  pronouns?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Registration>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
  unavailable?: Maybe<Scalars['String']['output']>;
};

export type PerformerInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  apartment?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  instrument?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['String']['input']>;
  otherClasses?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photoPermission?: InputMaybe<Scalars['Boolean']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  pronouns?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
  unavailable?: InputMaybe<Scalars['String']['input']>;
};

export type PerformerPayload = {
  __typename: 'PerformerPayload';
  performer?: Maybe<Performer>;
  userErrors: Array<UserError>;
};

/** SOLO, GROUP, SCHOOL, COMMUNITY */
export enum PerformerType {
  COMMUNITY = 'COMMUNITY',
  GROUP = 'GROUP',
  SCHOOL = 'SCHOOL',
  SOLO = 'SOLO'
}

export type Query = {
  __typename: 'Query';
  categories: Array<Category>;
  category: Category;
  checkIfPasswordExists: PasswordExists;
  checkUser: User;
  classType: ClassType;
  classTypes: Array<ClassType>;
  communities: Array<Community>;
  community: Community;
  communityGroup: CommunityGroup;
  communityGroups: Array<CommunityGroup>;
  discipline: Discipline;
  disciplines: Array<Discipline>;
  festivalClass: FestivalClass;
  festivalClassByNumber: FestivalClass;
  festivalClassSearch: Array<FestivalClass>;
  festivalClasses: Array<FestivalClass>;
  fieldConfig: FieldConfig;
  fieldConfigs: Array<FieldConfig>;
  group: Group;
  groups: Array<Group>;
  instrument: Instrument;
  instruments: Array<Instrument>;
  item: Item;
  items: Array<Item>;
  level: Level;
  levels: Array<Level>;
  logout: Scalars['String']['output'];
  myStudents: Teacher;
  myUser: User;
  order: Order;
  orderItem: OrderItem;
  orderItems: Array<OrderItem>;
  orders: Array<Order>;
  passwordChangeEmailVerification: EmailExists;
  performer: Performer;
  performers: Array<Performer>;
  registeredClass: RegisteredClass;
  registeredClasses: Array<RegisteredClass>;
  registration: Registration;
  registrations: Array<Registration>;
  school: School;
  schoolGroup: SchoolGroup;
  schoolGroups: Array<SchoolGroup>;
  schools: Array<School>;
  selection: Selection;
  selections: Array<Selection>;
  subdiscipline: Subdiscipline;
  subdisciplines: Array<Subdiscipline>;
  teacher?: Maybe<Teacher>;
  teachers: Array<Teacher>;
  tokenCheck: Scalars['Boolean']['output'];
  trophies: Array<Trophy>;
  trophy: Trophy;
  user: User;
  users: Array<User>;
};


export type QuerycategoriesArgs = {
  levelID?: InputMaybe<Scalars['Int']['input']>;
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QuerycheckIfPasswordExistsArgs = {
  id: Scalars['Int']['input'];
};


export type QuerycheckUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryclassTypeArgs = {
  id: Scalars['Int']['input'];
};


export type QuerycommunityArgs = {
  communityID?: InputMaybe<Scalars['Int']['input']>;
  registrationID?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerycommunityGroupArgs = {
  communityGroupID: Scalars['Int']['input'];
};


export type QuerycommunityGroupsArgs = {
  communityID?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerydisciplineArgs = {
  id: Scalars['Int']['input'];
};


export type QuerydisciplinesArgs = {
  instrument?: InputMaybe<Scalars['String']['input']>;
  performerType?: InputMaybe<PerformerType>;
};


export type QueryfestivalClassArgs = {
  id: Scalars['Int']['input'];
};


export type QueryfestivalClassByNumberArgs = {
  festivalClassNumber: Scalars['String']['input'];
};


export type QueryfestivalClassSearchArgs = {
  festivalClassSearch: FestivalClassSearchArgs;
};


export type QueryfestivalClassesArgs = {
  festivalClassSearch?: InputMaybe<FestivalClassSearchArgs>;
  performerType?: InputMaybe<PerformerType>;
};


export type QueryfieldConfigArgs = {
  fieldName: Scalars['String']['input'];
  tableName: Scalars['String']['input'];
};


export type QuerygroupArgs = {
  groupID?: InputMaybe<Scalars['Int']['input']>;
  registrationID?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygroupsArgs = {
  registrationID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryinstrumentArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryinstrumentsArgs = {
  disciplineID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryitemArgs = {
  id: Scalars['Int']['input'];
};


export type QuerylevelArgs = {
  id: Scalars['Int']['input'];
};


export type QuerylevelsArgs = {
  categoryID?: InputMaybe<Scalars['Int']['input']>;
  subdisciplineID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryorderArgs = {
  id: Scalars['Int']['input'];
};


export type QueryorderItemArgs = {
  itemID: Scalars['Int']['input'];
  orderID: Scalars['Int']['input'];
};


export type QueryorderItemsArgs = {
  orderID: Scalars['Int']['input'];
};


export type QuerypasswordChangeEmailVerificationArgs = {
  email: Scalars['String']['input'];
};


export type QueryperformerArgs = {
  performerID: Scalars['Int']['input'];
};


export type QueryperformersArgs = {
  registrationID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryregisteredClassArgs = {
  registeredClassID: Scalars['Int']['input'];
};


export type QueryregisteredClassesArgs = {
  registrationID: Scalars['Int']['input'];
};


export type QueryregistrationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryregistrationsArgs = {
  performerType?: InputMaybe<PerformerType>;
};


export type QueryschoolArgs = {
  registrationID?: InputMaybe<Scalars['Int']['input']>;
  schoolID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryschoolGroupArgs = {
  schoolGroupID: Scalars['Int']['input'];
};


export type QueryschoolGroupsArgs = {
  schoolID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryselectionArgs = {
  selectionID: Scalars['Int']['input'];
};


export type QueryselectionsArgs = {
  registeredClassID?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysubdisciplineArgs = {
  subdisciplineID: Scalars['Int']['input'];
};


export type QuerysubdisciplinesArgs = {
  disciplineID?: InputMaybe<Scalars['Int']['input']>;
  performerType?: InputMaybe<PerformerType>;
};


export type QueryteacherArgs = {
  teacherEmail?: InputMaybe<Scalars['String']['input']>;
  teacherID?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryteachersArgs = {
  teacherType: Scalars['String']['input'];
};


export type QuerytrophyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryuserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  userID?: InputMaybe<Scalars['Int']['input']>;
};

export type RegisteredClass = {
  __typename: 'RegisteredClass';
  category?: Maybe<Scalars['String']['output']>;
  classNumber?: Maybe<Scalars['String']['output']>;
  classType?: Maybe<Scalars['String']['output']>;
  communityGroupID?: Maybe<Scalars['Int']['output']>;
  discipline?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  level?: Maybe<Scalars['String']['output']>;
  maxSelections?: Maybe<Scalars['Int']['output']>;
  minSelections?: Maybe<Scalars['Int']['output']>;
  numberOfSelections?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  schoolGroupID?: Maybe<Scalars['Int']['output']>;
  selections?: Maybe<Array<Selection>>;
  subdiscipline?: Maybe<Scalars['String']['output']>;
};

export type RegisteredClassInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  classNumber?: InputMaybe<Scalars['String']['input']>;
  classType?: InputMaybe<Scalars['String']['input']>;
  communityGroupID?: InputMaybe<Scalars['Int']['input']>;
  discipline?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['String']['input']>;
  maxSelections?: InputMaybe<Scalars['Int']['input']>;
  minSelections?: InputMaybe<Scalars['Int']['input']>;
  numberOfSelections?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  schoolGroupID?: InputMaybe<Scalars['Int']['input']>;
  subdiscipline?: InputMaybe<Scalars['String']['input']>;
};

export type RegisteredClassPayload = {
  __typename: 'RegisteredClassPayload';
  registeredClass: RegisteredClass;
  userErrors: Array<UserError>;
};

export type Registration = {
  __typename: 'Registration';
  community?: Maybe<Community>;
  confirmation?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  group?: Maybe<Group>;
  id: Scalars['Int']['output'];
  label?: Maybe<Scalars['String']['output']>;
  payedAmt?: Maybe<Scalars['Float']['output']>;
  performerType: PerformerType;
  performers?: Maybe<Array<Performer>>;
  photoPermission?: Maybe<Scalars['Boolean']['output']>;
  registeredClasses?: Maybe<Array<RegisteredClass>>;
  school?: Maybe<School>;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
  teacher?: Maybe<User>;
  totalAmt?: Maybe<Scalars['Float']['output']>;
  transactionInfo?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
};

export type RegistrationInput = {
  confirmation?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  payedAmt?: InputMaybe<Scalars['Float']['input']>;
  performerType?: InputMaybe<PerformerType>;
  photoPermission?: InputMaybe<Scalars['Boolean']['input']>;
  submittedAt?: InputMaybe<Scalars['DateTime']['input']>;
  teacherID?: InputMaybe<Scalars['Int']['input']>;
  totalAmt?: InputMaybe<Scalars['Float']['input']>;
  transactionInfo?: InputMaybe<Scalars['String']['input']>;
};

export type RegistrationPayload = {
  __typename: 'RegistrationPayload';
  registration?: Maybe<Registration>;
  userErrors: Array<UserError>;
};

export type School = {
  __typename: 'School';
  city?: Maybe<Scalars['String']['output']>;
  division?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Registration>;
  schoolGroups?: Maybe<Array<SchoolGroup>>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
};

export type SchoolGroup = {
  __typename: 'SchoolGroup';
  chaperones?: Maybe<Scalars['Int']['output']>;
  conflictPerformers?: Maybe<Scalars['String']['output']>;
  earliestTime?: Maybe<Scalars['String']['output']>;
  groupSize?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  latestTime?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  photoPermission?: Maybe<Scalars['Boolean']['output']>;
  school?: Maybe<School>;
  unavailable?: Maybe<Scalars['String']['output']>;
  wheelchairs?: Maybe<Scalars['Int']['output']>;
};

export type SchoolGroupInput = {
  chaperones?: InputMaybe<Scalars['Int']['input']>;
  conflictPerformers?: InputMaybe<Scalars['String']['input']>;
  earliestTime?: InputMaybe<Scalars['String']['input']>;
  groupSize?: InputMaybe<Scalars['Int']['input']>;
  latestTime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photoPermission?: InputMaybe<Scalars['Boolean']['input']>;
  unavailable?: InputMaybe<Scalars['String']['input']>;
  wheelchairs?: InputMaybe<Scalars['Int']['input']>;
};

export type SchoolGroupPayload = {
  __typename: 'SchoolGroupPayload';
  schoolGroup?: Maybe<SchoolGroup>;
  userErrors: Array<UserError>;
};

export type SchoolInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
};

export type SchoolPayload = {
  __typename: 'SchoolPayload';
  school?: Maybe<School>;
  userErrors: Array<UserError>;
};

export type Selection = {
  __typename: 'Selection';
  composer?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  largerWork?: Maybe<Scalars['String']['output']>;
  movement?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SelectionInput = {
  composer?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['String']['input']>;
  largerWork?: InputMaybe<Scalars['String']['input']>;
  movement?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type SelectionPayload = {
  __typename: 'SelectionPayload';
  selection: Selection;
  userErrors: Array<UserError>;
};

export type Subdiscipline = {
  __typename: 'Subdiscipline';
  categories?: Maybe<Array<Category>>;
  description?: Maybe<Scalars['String']['output']>;
  discipline?: Maybe<Discipline>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int']['output'];
  levels?: Maybe<Array<Level>>;
  maxPerformers?: Maybe<Scalars['Int']['output']>;
  minPerformers?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  performerType?: Maybe<PerformerType>;
  price?: Maybe<Scalars['Decimal']['output']>;
};


export type SubdisciplinefestivalClassesArgs = {
  categoryID?: InputMaybe<Scalars['Int']['input']>;
  levelID?: InputMaybe<Scalars['Int']['input']>;
  performerType?: InputMaybe<PerformerType>;
};

export type SubdisciplineInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  disciplineID: Scalars['Int']['input'];
  maxPerformers?: InputMaybe<Scalars['Int']['input']>;
  minPerformers?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  performerType: PerformerType;
  price?: InputMaybe<Scalars['Decimal']['input']>;
};

export type SubdisciplinePayload = {
  __typename: 'SubdisciplinePayload';
  subdiscipline?: Maybe<Subdiscipline>;
  userErrors: Array<UserError>;
};

export type Submission = {
  __typename: 'Submission';
  confirmation: Scalars['String']['output'];
  payedAmt?: Maybe<Scalars['Decimal']['output']>;
  submittedAt: Scalars['DateTime']['output'];
};

export type Teacher = {
  __typename: 'Teacher';
  apartment?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  instrument?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  privateTeacher?: Maybe<Scalars['Boolean']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  registrations?: Maybe<Array<Registration>>;
  schoolTeacher?: Maybe<Scalars['Boolean']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
};

export type TeacherInput = {
  apartment?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  instrument?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  privateTeacher?: InputMaybe<Scalars['Boolean']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  schoolTeacher?: InputMaybe<Scalars['Boolean']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
};

export type TeacherPayload = {
  __typename: 'TeacherPayload';
  teacher?: Maybe<Teacher>;
  userErrors: Array<UserError>;
};

export type Trophy = {
  __typename: 'Trophy';
  description?: Maybe<Scalars['String']['output']>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type TrophyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type TrophyPayload = {
  __typename: 'TrophyPayload';
  trophy?: Maybe<Trophy>;
  userErrors: Array<UserError>;
};

export type User = {
  __typename: 'User';
  admin?: Maybe<Scalars['Boolean']['output']>;
  apartment?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailConfirmed?: Maybe<Scalars['Boolean']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  hasSignedIn?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  instrument?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  privateTeacher?: Maybe<Scalars['Boolean']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  registrations?: Maybe<Array<Registration>>;
  schoolTeacher?: Maybe<Scalars['Boolean']['output']>;
  staff?: Maybe<Scalars['Boolean']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
};

export type UserError = {
  __typename: 'UserError';
  field: Array<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type UserInput = {
  admin?: InputMaybe<Scalars['Boolean']['input']>;
  apartment?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  emailConfirmed?: InputMaybe<Scalars['Boolean']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hasSignedIn?: InputMaybe<Scalars['Boolean']['input']>;
  instrument?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  privateTeacher?: InputMaybe<Scalars['Boolean']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  schoolTeacher?: InputMaybe<Scalars['Boolean']['input']>;
  staff?: InputMaybe<Scalars['Boolean']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UserPayload = {
  __typename: 'UserPayload';
  user?: Maybe<User>;
  userErrors: Array<UserError>;
};

export type ClassCreateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
  registeredClass?: InputMaybe<RegisteredClassInput>;
}>;


export type ClassCreateMutation = { __typename: 'Mutation', registeredClassCreate: { __typename: 'RegisteredClassPayload', registeredClass: { __typename: 'RegisteredClass', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type ClassDeleteMutationVariables = Exact<{
  registeredClassId: Scalars['Int']['input'];
}>;


export type ClassDeleteMutation = { __typename: 'Mutation', registeredClassDelete: { __typename: 'RegisteredClassPayload', registeredClass: { __typename: 'RegisteredClass', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type ClassUpdateMutationVariables = Exact<{
  registeredClassId: Scalars['Int']['input'];
  registeredClass: RegisteredClassInput;
}>;


export type ClassUpdateMutation = { __typename: 'Mutation', registeredClassUpdate: { __typename: 'RegisteredClassPayload', registeredClass: { __typename: 'RegisteredClass', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityCreateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
  community: CommunityInput;
}>;


export type CommunityCreateMutation = { __typename: 'Mutation', communityCreate: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityDeleteMutationVariables = Exact<{
  communityId: Scalars['Int']['input'];
}>;


export type CommunityDeleteMutation = { __typename: 'Mutation', communityDelete: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityGroupCreateMutationVariables = Exact<{
  communityId: Scalars['Int']['input'];
}>;


export type CommunityGroupCreateMutation = { __typename: 'Mutation', communityGroupCreate: { __typename: 'CommunityGroupPayload', communityGroup?: { __typename: 'CommunityGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityGroupDeleteMutationVariables = Exact<{
  communityGroupId: Scalars['Int']['input'];
}>;


export type CommunityGroupDeleteMutation = { __typename: 'Mutation', communityGroupDelete: { __typename: 'CommunityGroupPayload', communityGroup?: { __typename: 'CommunityGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityGroupUpdateMutationVariables = Exact<{
  communityGroupId: Scalars['Int']['input'];
  communityGroup: CommunityGroupInput;
}>;


export type CommunityGroupUpdateMutation = { __typename: 'Mutation', communityGroupUpdate: { __typename: 'CommunityGroupPayload', communityGroup?: { __typename: 'CommunityGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityUpdateMutationVariables = Exact<{
  communityId: Scalars['Int']['input'];
  community: CommunityInput;
}>;


export type CommunityUpdateMutation = { __typename: 'Mutation', communityUpdate: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type GroupCreateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type GroupCreateMutation = { __typename: 'Mutation', groupCreate: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type GroupDeleteMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type GroupDeleteMutation = { __typename: 'Mutation', groupDelete: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type GroupUpdateMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  group: GroupInput;
}>;


export type GroupUpdateMutation = { __typename: 'Mutation', groupUpdate: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type ItemCreateMutationVariables = Exact<{
  itemInput: ItemInput;
}>;


export type ItemCreateMutation = { __typename: 'Mutation', itemCreate: { __typename: 'ItemPayload', item?: { __typename: 'Item', id: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type ItemDeleteMutationVariables = Exact<{
  itemDeleteId: Scalars['Int']['input'];
}>;


export type ItemDeleteMutation = { __typename: 'Mutation', itemDelete: { __typename: 'ItemPayload', item?: { __typename: 'Item', id: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type ItemUpdateMutationVariables = Exact<{
  itemUpdateId: Scalars['Int']['input'];
  itemInput: ItemInput;
}>;


export type ItemUpdateMutation = { __typename: 'Mutation', itemUpdate: { __typename: 'ItemPayload', item?: { __typename: 'Item', id: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type OrderCreateMutationVariables = Exact<{
  orderInput: OrderInput;
}>;


export type OrderCreateMutation = { __typename: 'Mutation', orderCreate: { __typename: 'OrderPayload', order?: { __typename: 'Order', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type OrderDeleteMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
}>;


export type OrderDeleteMutation = { __typename: 'Mutation', orderDelete: { __typename: 'OrderPayload', order?: { __typename: 'Order', id: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type OrderItemCreateMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
  orderItemInput: OrderItemInput;
}>;


export type OrderItemCreateMutation = { __typename: 'Mutation', orderItemCreate: { __typename: 'OrderItemPayload', orderItem?: { __typename: 'OrderItem', orderID: number, itemID: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type OrderItemDeleteMutationVariables = Exact<{
  itemId: Scalars['Int']['input'];
  orderId: Scalars['Int']['input'];
}>;


export type OrderItemDeleteMutation = { __typename: 'Mutation', orderItemDelete: { __typename: 'OrderItemPayload', orderItem?: { __typename: 'OrderItem', orderID: number, itemID: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type OrderItemUpdateMutationVariables = Exact<{
  itemId: Scalars['Int']['input'];
  orderId: Scalars['Int']['input'];
  orderItemInput: OrderItemInput;
}>;


export type OrderItemUpdateMutation = { __typename: 'Mutation', orderItemUpdate: { __typename: 'OrderItemPayload', orderItem?: { __typename: 'OrderItem', itemID: number, orderID: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type OrderUpdateMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
  orderInput: OrderInput;
}>;


export type OrderUpdateMutation = { __typename: 'Mutation', orderUpdate: { __typename: 'OrderPayload', order?: { __typename: 'Order', id: number } | null, userErrors: Array<{ __typename: 'UserError', field: Array<string>, message: string }> } };

export type PerformerCreateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
  performer: PerformerInput;
}>;


export type PerformerCreateMutation = { __typename: 'Mutation', performerCreate: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type PerformerDeleteMutationVariables = Exact<{
  performerId: Scalars['Int']['input'];
}>;


export type PerformerDeleteMutation = { __typename: 'Mutation', performerDelete: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type PerformerUpdateMutationVariables = Exact<{
  performerId: Scalars['Int']['input'];
  performer: PerformerInput;
}>;


export type PerformerUpdateMutation = { __typename: 'Mutation', performerUpdate: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type RegistrationCreateMutationVariables = Exact<{
  performerType: PerformerType;
  label: Scalars['String']['input'];
}>;


export type RegistrationCreateMutation = { __typename: 'Mutation', registrationCreate: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number, label?: string | null, performerType: PerformerType } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type RegistrationDeleteMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type RegistrationDeleteMutation = { __typename: 'Mutation', registrationDelete: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type RegistrationUpdateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
  registrationInput: RegistrationInput;
}>;


export type RegistrationUpdateMutation = { __typename: 'Mutation', registrationUpdate: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolCreateMutationVariables = Exact<{
  registrationId: Scalars['Int']['input'];
  school: SchoolInput;
}>;


export type SchoolCreateMutation = { __typename: 'Mutation', schoolCreate: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolDeleteMutationVariables = Exact<{
  schoolId: Scalars['Int']['input'];
}>;


export type SchoolDeleteMutation = { __typename: 'Mutation', schoolDelete: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupCreateMutationVariables = Exact<{
  schoolId: Scalars['Int']['input'];
}>;


export type SchoolGroupCreateMutation = { __typename: 'Mutation', schoolGroupCreate: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupDeleteMutationVariables = Exact<{
  schoolGroupId: Scalars['Int']['input'];
}>;


export type SchoolGroupDeleteMutation = { __typename: 'Mutation', schoolGroupDelete: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupUpdateMutationVariables = Exact<{
  schoolGroupId: Scalars['Int']['input'];
  schoolGroup: SchoolGroupInput;
}>;


export type SchoolGroupUpdateMutation = { __typename: 'Mutation', schoolGroupUpdate: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolUpdateMutationVariables = Exact<{
  schoolId: Scalars['Int']['input'];
  school: SchoolInput;
}>;


export type SchoolUpdateMutation = { __typename: 'Mutation', schoolUpdate: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionCreateMutationVariables = Exact<{
  registeredClassId: Scalars['Int']['input'];
}>;


export type SelectionCreateMutation = { __typename: 'Mutation', selectionCreate: { __typename: 'SelectionPayload', selection: { __typename: 'Selection', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionDeleteMutationVariables = Exact<{
  selectionId: Scalars['Int']['input'];
}>;


export type SelectionDeleteMutation = { __typename: 'Mutation', selectionDelete: { __typename: 'SelectionPayload', selection: { __typename: 'Selection', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionUpdateMutationVariables = Exact<{
  selectionId: Scalars['Int']['input'];
  selection: SelectionInput;
}>;


export type SelectionUpdateMutation = { __typename: 'Mutation', selectionUpdate: { __typename: 'SelectionPayload', selection: { __typename: 'Selection', id: number }, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherCreateMutationVariables = Exact<{
  privateTeacher: Scalars['Boolean']['input'];
  schoolTeacher: Scalars['Boolean']['input'];
  teacherInput: TeacherInput;
}>;


export type TeacherCreateMutation = { __typename: 'Mutation', teacherCreate: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number, email?: string | null, firstName?: string | null, lastName?: string | null, privateTeacher?: boolean | null, schoolTeacher?: boolean | null } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherDeleteMutationVariables = Exact<{
  teacherId: Scalars['Int']['input'];
}>;


export type TeacherDeleteMutation = { __typename: 'Mutation', teacherDelete: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherUpdateMutationVariables = Exact<{
  teacherId: Scalars['Int']['input'];
  teacher: TeacherInput;
}>;


export type TeacherUpdateMutation = { __typename: 'Mutation', teacherUpdate: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type UserUpdateMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
  user: UserInput;
}>;


export type UserUpdateMutation = { __typename: 'Mutation', userUpdate: { __typename: 'UserPayload', user?: { __typename: 'User', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SignInMutationVariables = Exact<{
  credentials: CredentialsSignin;
}>;


export type SignInMutation = { __typename: 'Mutation', signin: { __typename: 'AuthPayload', diatonicToken?: string | null, userErrors: Array<{ __typename: 'UserError', message: string }>, user?: { __typename: 'User', email?: string | null, firstName?: string | null, lastName?: string | null, privateTeacher?: boolean | null, hasSignedIn?: boolean | null } | null } };

export type SignUpMutationVariables = Exact<{
  credentials: CredentialsSignup;
}>;


export type SignUpMutation = { __typename: 'Mutation', signup: { __typename: 'AuthPayload', userErrors: Array<{ __typename: 'UserError', message: string }>, user?: { __typename: 'User', email?: string | null } | null } };

export type CommunityGroupInfoQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type CommunityGroupInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', community?: { __typename: 'Community', communityGroups?: Array<{ __typename: 'CommunityGroup', id: number, name?: string | null, groupSize?: number | null, chaperones?: number | null, wheelchairs?: number | null, earliestTime?: string | null, latestTime?: string | null, unavailable?: string | null, conflictPerformers?: string | null, photoPermission?: boolean | null }> | null } | null } };

export type CommunityInfoQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type CommunityInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', community?: { __typename: 'Community', id: number, name?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null, email?: string | null } | null } };

export type DisciplinesByTypeQueryVariables = Exact<{
  performerType: PerformerType;
}>;


export type DisciplinesByTypeQuery = { __typename: 'Query', disciplines: Array<{ __typename: 'Discipline', id: number, name: string, instruments?: Array<{ __typename: 'Instrument', id: number, name: string, mozart?: boolean | null }> | null }> };

export type GroupInfoQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type GroupInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', group?: { __typename: 'Group', id: number, age?: number | null, groupType?: string | null, instruments?: string | null, name?: string | null, numberOfPerformers?: number | null } | null } };

export type PerformersQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type PerformersQuery = { __typename: 'Query', performers: Array<{ __typename: 'Performer', id: number, pronouns?: string | null, firstName?: string | null, lastName?: string | null, age?: number | null, apartment?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null, email?: string | null, instrument?: string | null, level?: string | null, otherClasses?: string | null, unavailable?: string | null, photoPermission?: boolean | null }> };

export type RegisteredClassesQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type RegisteredClassesQuery = { __typename: 'Query', registration: { __typename: 'Registration', registeredClasses?: Array<{ __typename: 'RegisteredClass', category?: string | null, classType?: string | null, classNumber?: string | null, discipline?: string | null, id: number, level?: string | null, minSelections?: number | null, maxSelections?: number | null, numberOfSelections?: number | null, price?: any | null, subdiscipline?: string | null, schoolGroupID?: number | null, selections?: Array<{ __typename: 'Selection', composer?: string | null, duration?: string | null, id: number, largerWork?: string | null, movement?: string | null, title?: string | null }> | null }> | null } };

export type SchoolGroupInfoQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type SchoolGroupInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', school?: { __typename: 'School', schoolGroups?: Array<{ __typename: 'SchoolGroup', id: number, name?: string | null, groupSize?: number | null, chaperones?: number | null, wheelchairs?: number | null, earliestTime?: string | null, latestTime?: string | null, unavailable?: string | null, conflictPerformers?: string | null, photoPermission?: boolean | null }> | null } | null } };

export type SchoolInfoQueryVariables = Exact<{
  registrationId: Scalars['Int']['input'];
}>;


export type SchoolInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', school?: { __typename: 'School', id: number, name?: string | null, division?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null } | null } };

export type TeacherInfoQueryVariables = Exact<{
  teacherID?: InputMaybe<Scalars['Int']['input']>;
  teacherEmail?: InputMaybe<Scalars['String']['input']>;
}>;


export type TeacherInfoQuery = { __typename: 'Query', teacher?: { __typename: 'Teacher', id: number, firstName?: string | null, lastName?: string | null, apartment?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null, email?: string | null, instrument?: string | null } | null };

export type AllTeachersSearchQueryVariables = Exact<{
  teacherType: Scalars['String']['input'];
}>;


export type AllTeachersSearchQuery = { __typename: 'Query', teachers: Array<{ __typename: 'Teacher', id: number, firstName?: string | null, lastName?: string | null, instrument?: string | null }> };

export type CategoriesQueryVariables = Exact<{
  levelId?: InputMaybe<Scalars['Int']['input']>;
  subdisciplineId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CategoriesQuery = { __typename: 'Query', categories: Array<{ __typename: 'Category', id: number, name: string, description?: string | null, requiredComposer?: string | null }> };

export type ClassByNumberQueryVariables = Exact<{
  festivalClassNumber: Scalars['String']['input'];
}>;


export type ClassByNumberQuery = { __typename: 'Query', festivalClassByNumber: { __typename: 'FestivalClass', id: number, classNumber: string, maxSelections: number, minSelections: number, requiredSelection?: string | null, performerType: PerformerType, price?: number | null, category: { __typename: 'Category', id: number, name: string, description?: string | null, requiredComposer?: string | null }, level: { __typename: 'Level', id: number, name: string, description?: string | null }, subdiscipline: { __typename: 'Subdiscipline', id: number, name: string, description?: string | null, discipline?: { __typename: 'Discipline', id: number, name: string } | null }, trophies?: Array<{ __typename: 'Trophy', id: number, name: string, description?: string | null }> | null } };

export type FestivalClassSearchQueryVariables = Exact<{
  festivalClassSearch: FestivalClassSearchArgs;
}>;


export type FestivalClassSearchQuery = { __typename: 'Query', festivalClassSearch: Array<{ __typename: 'FestivalClass', id: number, classNumber: string, maxSelections: number, minSelections: number, requiredSelection?: string | null, performerType: PerformerType, price?: number | null, description?: string | null, classType: { __typename: 'ClassType', name: string, description?: string | null }, subdiscipline: { __typename: 'Subdiscipline', name: string, description?: string | null }, level: { __typename: 'Level', name: string, description?: string | null }, category: { __typename: 'Category', name: string, description?: string | null }, trophies?: Array<{ __typename: 'Trophy', id: number, name: string, description?: string | null }> | null }> };

export type FestivalClassesQueryVariables = Exact<{
  performerType?: InputMaybe<PerformerType>;
}>;


export type FestivalClassesQuery = { __typename: 'Query', festivalClasses: Array<{ __typename: 'FestivalClass', subdiscipline: { __typename: 'Subdiscipline', id: number, name: string } }> };

export type DisciplinesQueryVariables = Exact<{ [key: string]: never; }>;


export type DisciplinesQuery = { __typename: 'Query', disciplines: Array<{ __typename: 'Discipline', id: number, name: string }> };

export type FieldConfigQueryVariables = Exact<{
  fieldName: Scalars['String']['input'];
  tableName: Scalars['String']['input'];
}>;


export type FieldConfigQuery = { __typename: 'Query', fieldConfig: { __typename: 'FieldConfig', id: number, tableName: string, fieldName: string, customField: boolean, customFieldType?: string | null, submissionRequired: boolean } };

export type FieldConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type FieldConfigsQuery = { __typename: 'Query', fieldConfigs: Array<{ __typename: 'FieldConfig', tableName: string, fieldName: string, communityRequired: boolean, groupRequired: boolean, schoolRequired: boolean, soloRequired: boolean, customField: boolean, customFieldType?: string | null }> };

export type instrumentQueryVariables = Exact<{
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  instrumentName?: InputMaybe<Scalars['String']['input']>;
}>;


export type instrumentQuery = { __typename: 'Query', instrument: { __typename: 'Instrument', name: string, mozart?: boolean | null, discipline?: { __typename: 'Discipline', name: string } | null } };

export type InstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstrumentsQuery = { __typename: 'Query', instruments: Array<{ __typename: 'Instrument', id: number, name: string, mozart?: boolean | null, discipline?: { __typename: 'Discipline', name: string } | null }> };

export type ItemQueryVariables = Exact<{
  itemId: Scalars['Int']['input'];
}>;


export type ItemQuery = { __typename: 'Query', item: { __typename: 'Item', name?: string | null, description?: string | null, startDate?: any | null, endDate?: any | null, price?: number | null, taxable?: boolean | null, transferable?: boolean | null, createdAt?: any | null, updatedAt?: any | null } };

export type ItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ItemsQuery = { __typename: 'Query', items: Array<{ __typename: 'Item', id: number, name?: string | null, description?: string | null, startDate?: any | null, endDate?: any | null, price?: number | null, taxable?: boolean | null, transferable?: boolean | null, createdAt?: any | null, updatedAt?: any | null }> };

export type LevelsQueryVariables = Exact<{
  subdisciplineId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LevelsQuery = { __typename: 'Query', levels: Array<{ __typename: 'Level', id: number, name: string, description?: string | null }> };

export type MyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUserQuery = { __typename: 'Query', myUser: { __typename: 'User', id: number, firstName?: string | null, lastName?: string | null, apartment?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null, email?: string | null, emailConfirmed?: boolean | null, instrument?: string | null, privateTeacher?: boolean | null, schoolTeacher?: boolean | null, hasSignedIn?: boolean | null } };

export type OrderQueryVariables = Exact<{
  orderId: Scalars['Int']['input'];
}>;


export type OrderQuery = { __typename: 'Query', order: { __typename: 'Order', id: number, totalAmount?: number | null, payedAmount?: number | null, purchaseDate?: any | null, deliveryDate?: any | null, methodDelivered?: string | null, createdAt?: any | null, updatedAt?: any | null, orderItems?: Array<{ __typename: 'OrderItem', itemID: number, namesOnItems: Array<string>, notes?: string | null, quantity: number, item?: { __typename: 'Item', id: number, name?: string | null, description?: string | null, startDate?: any | null, endDate?: any | null, price?: number | null, notes?: string | null, taxable?: boolean | null, transferable?: boolean | null } | null }> | null } };

export type OrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type OrdersQuery = { __typename: 'Query', orders: Array<{ __typename: 'Order', id: number, totalAmount?: number | null, payedAmount?: number | null, purchaseDate?: any | null, deliveryDate?: any | null, methodDelivered?: string | null, createdAt?: any | null, updatedAt?: any | null, orderItems?: Array<{ __typename: 'OrderItem', itemID: number, namesOnItems: Array<string>, notes?: string | null, quantity: number, item?: { __typename: 'Item', id: number, name?: string | null, description?: string | null, startDate?: any | null, endDate?: any | null, price?: number | null, notes?: string | null, taxable?: boolean | null, transferable?: boolean | null } | null }> | null }> };

export type RegistrationsQueryVariables = Exact<{
  performerType?: InputMaybe<PerformerType>;
}>;


export type RegistrationsQuery = { __typename: 'Query', registrations: Array<{ __typename: 'Registration', id: number, confirmation?: string | null, label?: string | null, payedAmt?: number | null, performerType: PerformerType, submittedAt?: any | null, totalAmt?: number | null, transactionInfo?: string | null, createdAt?: any | null, updatedAt?: any | null, teacher?: { __typename: 'User', id: number } | null }> };

export type StudentRegistrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentRegistrationsQuery = { __typename: 'Query', myStudents: { __typename: 'Teacher', registrations?: Array<{ __typename: 'Registration', confirmation?: string | null, createdAt?: any | null, id: number, label?: string | null, performerType: PerformerType, submittedAt?: any | null, updatedAt?: any | null, performers?: Array<{ __typename: 'Performer', firstName?: string | null, lastName?: string | null }> | null, group?: { __typename: 'Group', name?: string | null } | null, school?: { __typename: 'School', name?: string | null } | null, community?: { __typename: 'Community', name?: string | null } | null }> | null } };

export type SubDisciplinesQueryVariables = Exact<{
  disciplineId: Scalars['Int']['input'];
  performerType: PerformerType;
}>;


export type SubDisciplinesQuery = { __typename: 'Query', subdisciplines: Array<{ __typename: 'Subdiscipline', id: number, name: string, description?: string | null }> };

export type SubdisciplinesByTypeQueryVariables = Exact<{
  disciplineId: Scalars['Int']['input'];
  performerType: PerformerType;
}>;


export type SubdisciplinesByTypeQuery = { __typename: 'Query', subdisciplines: Array<{ __typename: 'Subdiscipline', id: number, name: string, description?: string | null, maxPerformers?: number | null, minPerformers?: number | null, performerType?: PerformerType | null }> };


export const ClassCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisteredClassInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"registeredClass"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassCreateMutation, ClassCreateMutationVariables>;
export const ClassDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassDeleteMutation, ClassDeleteMutationVariables>;
export const ClassUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisteredClassInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}},{"kind":"Argument","name":{"kind":"Name","value":"registeredClassInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassUpdateMutation, ClassUpdateMutationVariables>;
export const CommunityCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"community"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"communityInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"community"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityCreateMutation, CommunityCreateMutationVariables>;
export const CommunityDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityDeleteMutation, CommunityDeleteMutationVariables>;
export const CommunityGroupCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityGroupCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroupCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityGroupCreateMutation, CommunityGroupCreateMutationVariables>;
export const CommunityGroupDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityGroupDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroupDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityGroupDeleteMutation, CommunityGroupDeleteMutationVariables>;
export const CommunityGroupUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityGroupUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroupUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"communityGroupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityGroupUpdateMutation, CommunityGroupUpdateMutationVariables>;
export const CommunityUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"community"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"communityInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"community"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityUpdateMutation, CommunityUpdateMutationVariables>;
export const GroupCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupCreateMutation, GroupCreateMutationVariables>;
export const GroupDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupDeleteMutation, GroupDeleteMutationVariables>;
export const GroupUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"group"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"group"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupUpdateMutation, GroupUpdateMutationVariables>;
export const ItemCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ItemCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ItemCreateMutation, ItemCreateMutationVariables>;
export const ItemDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ItemDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemDeleteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemDeleteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ItemDeleteMutation, ItemDeleteMutationVariables>;
export const ItemUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ItemUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemUpdateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemUpdateId"}}},{"kind":"Argument","name":{"kind":"Name","value":"itemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ItemUpdateMutation, ItemUpdateMutationVariables>;
export const OrderCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderCreateMutation, OrderCreateMutationVariables>;
export const OrderDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderDeleteMutation, OrderDeleteMutationVariables>;
export const OrderItemCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderItemCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItemCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderID"}},{"kind":"Field","name":{"kind":"Name","value":"itemID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderItemCreateMutation, OrderItemCreateMutationVariables>;
export const OrderItemDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderItemDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItemDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"itemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderID"}},{"kind":"Field","name":{"kind":"Name","value":"itemID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderItemDeleteMutation, OrderItemDeleteMutationVariables>;
export const OrderItemUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderItemUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderItemInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItemUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"itemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderItemInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderItemInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemID"}},{"kind":"Field","name":{"kind":"Name","value":"orderID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderItemUpdateMutation, OrderItemUpdateMutationVariables>;
export const OrderUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<OrderUpdateMutation, OrderUpdateMutationVariables>;
export const PerformerCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerCreateMutation, PerformerCreateMutationVariables>;
export const PerformerDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerDeleteMutation, PerformerDeleteMutationVariables>;
export const PerformerUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerUpdateMutation, PerformerUpdateMutationVariables>;
export const RegistrationCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"label"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}},{"kind":"Argument","name":{"kind":"Name","value":"label"},"value":{"kind":"Variable","name":{"kind":"Name","value":"label"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationCreateMutation, RegistrationCreateMutationVariables>;
export const RegistrationDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationDeleteMutation, RegistrationDeleteMutationVariables>;
export const RegistrationUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"registrationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationUpdateMutation, RegistrationUpdateMutationVariables>;
export const SchoolCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolCreateMutation, SchoolCreateMutationVariables>;
export const SchoolDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolDeleteMutation, SchoolDeleteMutationVariables>;
export const SchoolGroupCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupCreateMutation, SchoolGroupCreateMutationVariables>;
export const SchoolGroupDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupDeleteMutation, SchoolGroupDeleteMutationVariables>;
export const SchoolGroupUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupUpdateMutation, SchoolGroupUpdateMutationVariables>;
export const SchoolUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolUpdateMutation, SchoolUpdateMutationVariables>;
export const SelectionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionCreateMutation, SelectionCreateMutationVariables>;
export const SelectionDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"selectionID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionDeleteMutation, SelectionDeleteMutationVariables>;
export const SelectionUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SelectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"selectionID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"selectionInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionUpdateMutation, SelectionUpdateMutationVariables>;
export const TeacherCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"privateTeacher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolTeacher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeacherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"privateTeacher"},"value":{"kind":"Variable","name":{"kind":"Name","value":"privateTeacher"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolTeacher"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolTeacher"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacherInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"privateTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"schoolTeacher"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherCreateMutation, TeacherCreateMutationVariables>;
export const TeacherDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherDeleteMutation, TeacherDeleteMutationVariables>;
export const TeacherUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeacherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacherInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherUpdateMutation, TeacherUpdateMutationVariables>;
export const UserUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UserUpdateMutation, UserUpdateMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialsSignin"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"diatonicToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"privateTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"hasSignedIn"}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialsSignup"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const CommunityGroupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityGroupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupSize"}},{"kind":"Field","name":{"kind":"Name","value":"chaperones"}},{"kind":"Field","name":{"kind":"Name","value":"wheelchairs"}},{"kind":"Field","name":{"kind":"Name","value":"earliestTime"}},{"kind":"Field","name":{"kind":"Name","value":"latestTime"}},{"kind":"Field","name":{"kind":"Name","value":"unavailable"}},{"kind":"Field","name":{"kind":"Name","value":"conflictPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"photoPermission"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommunityGroupInfoQuery, CommunityGroupInfoQueryVariables>;
export const CommunityInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityInfoQuery, CommunityInfoQueryVariables>;
export const DisciplinesByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DisciplinesByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mozart"}}]}}]}}]}}]} as unknown as DocumentNode<DisciplinesByTypeQuery, DisciplinesByTypeQueryVariables>;
export const GroupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"groupType"}},{"kind":"Field","name":{"kind":"Name","value":"instruments"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPerformers"}}]}}]}}]}}]} as unknown as DocumentNode<GroupInfoQuery, GroupInfoQueryVariables>;
export const PerformersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Performers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pronouns"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"apartment"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"instrument"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"otherClasses"}},{"kind":"Field","name":{"kind":"Name","value":"unavailable"}},{"kind":"Field","name":{"kind":"Name","value":"photoPermission"}}]}}]}}]} as unknown as DocumentNode<PerformersQuery, PerformersQueryVariables>;
export const RegisteredClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RegisteredClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClasses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"classType"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSelections"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"}},{"kind":"Field","name":{"kind":"Name","value":"schoolGroupID"}},{"kind":"Field","name":{"kind":"Name","value":"selections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composer"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"largerWork"}},{"kind":"Field","name":{"kind":"Name","value":"movement"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisteredClassesQuery, RegisteredClassesQueryVariables>;
export const SchoolGroupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolGroupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupSize"}},{"kind":"Field","name":{"kind":"Name","value":"chaperones"}},{"kind":"Field","name":{"kind":"Name","value":"wheelchairs"}},{"kind":"Field","name":{"kind":"Name","value":"earliestTime"}},{"kind":"Field","name":{"kind":"Name","value":"latestTime"}},{"kind":"Field","name":{"kind":"Name","value":"unavailable"}},{"kind":"Field","name":{"kind":"Name","value":"conflictPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"photoPermission"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupInfoQuery, SchoolGroupInfoQueryVariables>;
export const SchoolInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"division"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolInfoQuery, SchoolInfoQueryVariables>;
export const TeacherInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeacherInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherID"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacherEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherEmail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"apartment"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"instrument"}}]}}]}}]} as unknown as DocumentNode<TeacherInfoQuery, TeacherInfoQueryVariables>;
export const AllTeachersSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllTeachersSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teachers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"instrument"}}]}}]}}]} as unknown as DocumentNode<AllTeachersSearchQuery, AllTeachersSearchQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"levelID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdisciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"requiredComposer"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const ClassByNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassByNumber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClassByNumber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"festivalClassNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"requiredSelection"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"requiredComposer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"trophies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ClassByNumberQuery, ClassByNumberQueryVariables>;
export const FestivalClassSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FestivalClassSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassSearch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FestivalClassSearchArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClassSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"festivalClassSearch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"classType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"requiredSelection"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trophies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<FestivalClassSearchQuery, FestivalClassSearchQueryVariables>;
export const FestivalClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FestivalClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClasses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FestivalClassesQuery, FestivalClassesQueryVariables>;
export const DisciplinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Disciplines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disciplines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DisciplinesQuery, DisciplinesQueryVariables>;
export const FieldConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FieldConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fieldName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldName"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"customField"}},{"kind":"Field","name":{"kind":"Name","value":"customFieldType"}},{"kind":"Field","name":{"kind":"Name","value":"submissionRequired"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<FieldConfigQuery, FieldConfigQueryVariables>;
export const FieldConfigsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FieldConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"communityRequired"}},{"kind":"Field","name":{"kind":"Name","value":"groupRequired"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRequired"}},{"kind":"Field","name":{"kind":"Name","value":"soloRequired"}},{"kind":"Field","name":{"kind":"Name","value":"customField"}},{"kind":"Field","name":{"kind":"Name","value":"customFieldType"}}]}}]}}]} as unknown as DocumentNode<FieldConfigsQuery, FieldConfigsQueryVariables>;
export const instrumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"instrument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instrumentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instrumentName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instrument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instrumentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instrumentName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mozart"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<instrumentQuery, instrumentQueryVariables>;
export const InstrumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mozart"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<InstrumentsQuery, InstrumentsQueryVariables>;
export const ItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Item"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"taxable"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ItemQuery, ItemQueryVariables>;
export const ItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"taxable"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const LevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Levels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdisciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<LevelsQuery, LevelsQueryVariables>;
export const MyUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"apartment"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"instrument"}},{"kind":"Field","name":{"kind":"Name","value":"privateTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"schoolTeacher"}},{"kind":"Field","name":{"kind":"Name","value":"hasSignedIn"}}]}}]}}]} as unknown as DocumentNode<MyUserQuery, MyUserQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseDate"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDate"}},{"kind":"Field","name":{"kind":"Name","value":"methodDelivered"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemID"}},{"kind":"Field","name":{"kind":"Name","value":"namesOnItems"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"taxable"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const OrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"payedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseDate"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDate"}},{"kind":"Field","name":{"kind":"Name","value":"methodDelivered"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemID"}},{"kind":"Field","name":{"kind":"Name","value":"namesOnItems"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"taxable"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
export const RegistrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Registrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmation"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"payedAmt"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalAmt"}},{"kind":"Field","name":{"kind":"Name","value":"transactionInfo"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RegistrationsQuery, RegistrationsQueryVariables>;
export const StudentRegistrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentRegistrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myStudents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"performers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentRegistrationsQuery, StudentRegistrationsQueryVariables>;
export const SubDisciplinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubDisciplines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdisciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"disciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<SubDisciplinesQuery, SubDisciplinesQueryVariables>;
export const SubdisciplinesByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdisciplinesByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdisciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"disciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"minPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}}]}}]}}]} as unknown as DocumentNode<SubdisciplinesByTypeQuery, SubdisciplinesByTypeQueryVariables>;