/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** An arbitrary-precision Decimal type */
  Decimal: any;
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  diatonicToken?: Maybe<Scalars['String']>;
  user: User;
  userErrors: Array<UserError>;
};

export type Category = {
  __typename: 'Category';
  description?: Maybe<Scalars['String']>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int'];
  name: Scalars['String'];
  requiredComposer?: Maybe<Scalars['String']>;
};


export type CategoryfestivalClassesArgs = {
  levelID: Scalars['Int'];
  performerType: Scalars['String'];
  subdisciplineID: Scalars['Int'];
};

export type CategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  requiredComposer?: InputMaybe<Scalars['String']>;
};

export type CategoryPayload = {
  __typename: 'CategoryPayload';
  category?: Maybe<Category>;
  userErrors: Array<UserError>;
};

export type Community = {
  __typename: 'Community';
  chaperones?: Maybe<Scalars['Int']>;
  conflictPerformers?: Maybe<Scalars['String']>;
  earliestTime?: Maybe<Scalars['String']>;
  groupSize?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  latestTime?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  unavailable?: Maybe<Scalars['String']>;
  wheelchairs?: Maybe<Scalars['Int']>;
};

export type CommunityInput = {
  chaperones?: InputMaybe<Scalars['Int']>;
  conflictPerformers?: InputMaybe<Scalars['String']>;
  earliestTime?: InputMaybe<Scalars['String']>;
  groupSize?: InputMaybe<Scalars['Int']>;
  latestTime?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  unavailable?: InputMaybe<Scalars['String']>;
  wheelchairs?: InputMaybe<Scalars['Int']>;
};

export type CommunityPayload = {
  __typename: 'CommunityPayload';
  community?: Maybe<Community>;
  userErrors: Array<UserError>;
};

export type CredentialsSignin = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CredentialsSignup = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type Discipline = {
  __typename: 'Discipline';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  subdisciplines?: Maybe<Array<Subdiscipline>>;
};


export type DisciplinesubdisciplinesArgs = {
  performerType?: InputMaybe<PerformerType>;
};

export type DisciplineInput = {
  name: Scalars['String'];
};

export type DisciplinePayload = {
  __typename: 'DisciplinePayload';
  discipline?: Maybe<Discipline>;
  userErrors: Array<UserError>;
};

export type FestivalClass = {
  __typename: 'FestivalClass';
  category: Category;
  classNumber: Scalars['String'];
  id: Scalars['Int'];
  level: Level;
  maxSelections: Scalars['Int'];
  minSelections: Scalars['Int'];
  performerType: PerformerType;
  price?: Maybe<Scalars['Decimal']>;
  requiredSelection?: Maybe<Scalars['String']>;
  subdiscipline: Subdiscipline;
  trophies?: Maybe<Array<Trophy>>;
};

export type FestivalClassInput = {
  categoryID: Scalars['Int'];
  classNumber: Scalars['String'];
  levelID: Scalars['Int'];
  maxSelections: Scalars['Int'];
  minSelections: Scalars['Int'];
  performerType: PerformerType;
  price?: InputMaybe<Scalars['Decimal']>;
  requiredSelection?: InputMaybe<Scalars['String']>;
  subdisciplineID: Scalars['Int'];
};

export type FestivalClassPayload = {
  __typename: 'FestivalClassPayload';
  festivalClass?: Maybe<FestivalClass>;
  userErrors: Array<UserError>;
};

export type FestivalClassSearchArgs = {
  categoryID?: InputMaybe<Scalars['Int']>;
  levelID?: InputMaybe<Scalars['Int']>;
  subdisciplineID?: InputMaybe<Scalars['Int']>;
};

export type Group = {
  __typename: 'Group';
  age?: Maybe<Scalars['Int']>;
  groupType?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  instruments?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberOfPerformers?: Maybe<Scalars['Int']>;
};

export type GroupInput = {
  age?: InputMaybe<Scalars['Int']>;
  groupType?: InputMaybe<Scalars['String']>;
  instruments?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  numberOfPerformers?: InputMaybe<Scalars['Int']>;
};

export type GroupPayload = {
  __typename: 'GroupPayload';
  group?: Maybe<Group>;
  userErrors?: Maybe<Array<UserError>>;
};

export type Instrument = {
  __typename: 'Instrument';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type InstrumentInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type InstrumentPayload = {
  __typename: 'InstrumentPayload';
  instrument?: Maybe<Instrument>;
  userErrors: Array<UserError>;
};

export type Level = {
  __typename: 'Level';
  classes?: Maybe<Array<FestivalClass>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
};


export type LevelclassesArgs = {
  categoryID: Scalars['Int'];
  performerType: Scalars['String'];
  subdisciplineID: Scalars['Int'];
};

export type LevelInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
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
  communityCreate: CommunityPayload;
  communityDelete: CommunityPayload;
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
  levelCreate: LevelPayload;
  levelDelete: LevelPayload;
  levelUpdate: LevelPayload;
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
  submitRegistration: SubmissionPayload;
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
  id: Scalars['Int'];
};


export type MutationcategoryUpdateArgs = {
  categoryID: Scalars['Int'];
  categoryInput: CategoryInput;
};


export type MutationcommunityCreateArgs = {
  registrationID: Scalars['Int'];
};


export type MutationcommunityDeleteArgs = {
  communityID: Scalars['Int'];
};


export type MutationcommunityUpdateArgs = {
  communityID: Scalars['Int'];
  communityInput: CommunityInput;
};


export type MutationdisciplineCreateArgs = {
  disciplineInput: DisciplineInput;
};


export type MutationdisciplineDeleteArgs = {
  id: Scalars['Int'];
};


export type MutationdisciplineUpdateArgs = {
  disciplineInput: DisciplineInput;
  id: Scalars['Int'];
};


export type MutationfestivalClassCreateArgs = {
  festivalClass: FestivalClassInput;
  performerType: Scalars['String'];
};


export type MutationfestivalClassDeleteArgs = {
  festivalClassID: Scalars['Int'];
};


export type MutationfestivalClassUpdateArgs = {
  festivalClass: FestivalClassInput;
  festivalClassID: Scalars['Int'];
};


export type MutationgroupCreateArgs = {
  registrationID: Scalars['Int'];
};


export type MutationgroupDeleteArgs = {
  groupID: Scalars['Int'];
};


export type MutationgroupUpdateArgs = {
  groupID: Scalars['Int'];
  groupInput: GroupInput;
};


export type MutationinstrumentCreateArgs = {
  instrument: InstrumentInput;
};


export type MutationinstrumentDeleteArgs = {
  id: Scalars['Int'];
};


export type MutationinstrumentUpdateArgs = {
  instrument: InstrumentInput;
  instrumentID: Scalars['Int'];
};


export type MutationlevelCreateArgs = {
  levelInput: LevelInput;
};


export type MutationlevelDeleteArgs = {
  levelID: Scalars['Int'];
};


export type MutationlevelUpdateArgs = {
  levelID: Scalars['Int'];
  levelInput: LevelInput;
};


export type MutationperformerCreateArgs = {
  registrationID: Scalars['Int'];
};


export type MutationperformerDeleteArgs = {
  performerID: Scalars['Int'];
};


export type MutationperformerUpdateArgs = {
  performerID: Scalars['Int'];
  performerInput: PerformerInput;
};


export type MutationregisteredClassCreateArgs = {
  registrationID: Scalars['Int'];
};


export type MutationregisteredClassDeleteArgs = {
  registeredClassID: Scalars['Int'];
};


export type MutationregisteredClassUpdateArgs = {
  registeredClassID: Scalars['Int'];
  registeredClassInput: RegisteredClassInput;
};


export type MutationregistrationCreateArgs = {
  label: Scalars['String'];
  performerType: PerformerType;
};


export type MutationregistrationDeleteArgs = {
  registrationID: Scalars['Int'];
};


export type MutationregistrationUpdateArgs = {
  registrationID: Scalars['Int'];
  registrationInput: RegistrationInput;
};


export type MutationschoolCreateArgs = {
  registrationID: Scalars['Int'];
};


export type MutationschoolDeleteArgs = {
  schoolID: Scalars['Int'];
};


export type MutationschoolGroupCreateArgs = {
  schoolID: Scalars['Int'];
};


export type MutationschoolGroupDeleteArgs = {
  schoolGroupID: Scalars['Int'];
};


export type MutationschoolGroupUpdateArgs = {
  schoolGroupID: Scalars['Int'];
  schoolGroupInput: SchoolGroupInput;
};


export type MutationschoolUpdateArgs = {
  schoolID: Scalars['Int'];
  schoolInput: SchoolInput;
};


export type MutationselectionCreateArgs = {
  registeredClassID: Scalars['Int'];
};


export type MutationselectionDeleteArgs = {
  selectionID: Scalars['Int'];
};


export type MutationselectionUpdateArgs = {
  selectionID: Scalars['Int'];
  selectionInput: SelectionInput;
};


export type MutationsigninArgs = {
  credentials: CredentialsSignin;
};


export type MutationsignupArgs = {
  credentials: CredentialsSignup;
};


export type MutationsubdisciplineCreateArgs = {
  disciplineID: Scalars['Int'];
  subdisciplineInput: SubdisciplineInput;
};


export type MutationsubdisciplineDeleteArgs = {
  subdisciplineID: Scalars['Int'];
};


export type MutationsubdisciplineUpdateArgs = {
  subdisciplineID: Scalars['Int'];
  subdisciplineInput: SubdisciplineInput;
};


export type MutationsubmitRegistrationArgs = {
  registrationID: Scalars['Int'];
};


export type MutationteacherCreateArgs = {
  registrationID: Scalars['Int'];
  teacherInput: TeacherInput;
};


export type MutationteacherDeleteArgs = {
  teacherID: Scalars['Int'];
};


export type MutationteacherUpdateArgs = {
  teacherID: Scalars['Int'];
  teacherInput: TeacherInput;
};


export type MutationtrophyCreateArgs = {
  trophyInput: TrophyInput;
};


export type MutationtrophyDeleteArgs = {
  id: Scalars['Int'];
};


export type MutationtrophyUpdateArgs = {
  trophyID: Scalars['Int'];
  trophyInput: TrophyInput;
};


export type MutationuserDeleteArgs = {
  id: Scalars['Int'];
};


export type MutationuserUpdateArgs = {
  userID: Scalars['Int'];
  userInput: Scalars['Int'];
};

export type Performer = {
  __typename: 'Performer';
  age?: Maybe<Scalars['Int']>;
  apartment?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  instrument?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
  otherClasses?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  streetName?: Maybe<Scalars['String']>;
  streetNumber?: Maybe<Scalars['String']>;
};

export type PerformerInput = {
  age?: InputMaybe<Scalars['Int']>;
  apartment?: InputMaybe<Scalars['String']>;
  city: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  instrument?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['String']>;
  otherClasses?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province: Scalars['String'];
  streetName?: InputMaybe<Scalars['String']>;
  streetNumber?: InputMaybe<Scalars['String']>;
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
  communities: Array<Community>;
  community: Community;
  discipline: Discipline;
  disciplines: Array<Discipline>;
  festivalClass: FestivalClass;
  festivalClassByNumber: FestivalClass;
  festivalClassSearch: Array<FestivalClass>;
  festivalClasses: Array<FestivalClass>;
  group: Group;
  groups: Array<Group>;
  instrument: Instrument;
  instruments: Array<Instrument>;
  level: Level;
  levels: Array<Level>;
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
  subdisciplinesByName: Array<Subdiscipline>;
  submissions: Array<Registration>;
  teacher: Teacher;
  teachers: Array<Teacher>;
  trophies: Array<Trophy>;
  trophy: Trophy;
  user: User;
  users: Array<User>;
};


export type QuerycategoriesArgs = {
  levelID?: InputMaybe<Scalars['Int']>;
  subdisciplineID?: InputMaybe<Scalars['Int']>;
};


export type QuerycategoryArgs = {
  id: Scalars['Int'];
};


export type QuerycommunityArgs = {
  registrationID: Scalars['Int'];
};


export type QuerydisciplineArgs = {
  id: Scalars['Int'];
};


export type QuerydisciplinesArgs = {
  performerType?: InputMaybe<PerformerType>;
};


export type QueryfestivalClassArgs = {
  id: Scalars['Int'];
};


export type QueryfestivalClassByNumberArgs = {
  festivalClassNumber: Scalars['String'];
};


export type QueryfestivalClassSearchArgs = {
  festivalClassSearch: FestivalClassSearchArgs;
};


export type QueryfestivalClassesArgs = {
  festivalClassSearch?: InputMaybe<FestivalClassSearchArgs>;
  performerType?: InputMaybe<PerformerType>;
};


export type QuerygroupArgs = {
  registrationID: Scalars['Int'];
};


export type QueryinstrumentArgs = {
  id: Scalars['Int'];
};


export type QuerylevelArgs = {
  id: Scalars['Int'];
};


export type QuerylevelsArgs = {
  categoryID?: InputMaybe<Scalars['Int']>;
  subdisciplineID?: InputMaybe<Scalars['Int']>;
};


export type QueryperformerArgs = {
  performerID: Scalars['Int'];
};


export type QueryperformersArgs = {
  registrationID: Scalars['Int'];
};


export type QueryregisteredClassArgs = {
  registeredClassID: Scalars['Int'];
};


export type QueryregisteredClassesArgs = {
  registrationID: Scalars['Int'];
};


export type QueryregistrationArgs = {
  id: Scalars['Int'];
};


export type QueryregistrationsArgs = {
  performerType?: InputMaybe<PerformerType>;
};


export type QueryschoolArgs = {
  schoolID: Scalars['Int'];
};


export type QueryschoolGroupArgs = {
  schoolGroupID: Scalars['Int'];
};


export type QueryschoolGroupsArgs = {
  schoolID: Scalars['Int'];
};


export type QueryselectionArgs = {
  selectionID: Scalars['Int'];
};


export type QueryselectionsArgs = {
  registeredClassID?: InputMaybe<Scalars['Int']>;
};


export type QuerysubdisciplineArgs = {
  subdisciplineID: Scalars['Int'];
};


export type QuerysubdisciplinesArgs = {
  disciplineID?: InputMaybe<Scalars['Int']>;
  performerType?: InputMaybe<PerformerType>;
};


export type QuerysubdisciplinesByNameArgs = {
  name: Scalars['String'];
};


export type QuerysubmissionsArgs = {
  performerType: PerformerType;
};


export type QueryteacherArgs = {
  teacherID: Scalars['Int'];
};


export type QuerytrophyArgs = {
  id: Scalars['Int'];
};


export type QueryuserArgs = {
  userID: Scalars['Int'];
};

export type RegisteredClass = {
  __typename: 'RegisteredClass';
  category?: Maybe<Scalars['String']>;
  classNumber?: Maybe<Scalars['String']>;
  discipline?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  level?: Maybe<Scalars['String']>;
  maxSelections?: Maybe<Scalars['Int']>;
  minSelections?: Maybe<Scalars['Int']>;
  numberOfSelections?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Decimal']>;
  schoolGroupID?: Maybe<Scalars['Int']>;
  selections?: Maybe<Array<Selection>>;
  subdiscipline?: Maybe<Scalars['String']>;
};

export type RegisteredClassInput = {
  category?: InputMaybe<Scalars['String']>;
  classNumber?: InputMaybe<Scalars['String']>;
  discipline?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['String']>;
  maxSelections?: InputMaybe<Scalars['Int']>;
  minSelections?: InputMaybe<Scalars['Int']>;
  numberOfSelections?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Decimal']>;
  schoolGroupID?: InputMaybe<Scalars['Int']>;
  subdiscipline?: InputMaybe<Scalars['String']>;
};

export type RegisteredClassPayload = {
  __typename: 'RegisteredClassPayload';
  registeredClass?: Maybe<RegisteredClass>;
  userErrors: Array<UserError>;
};

export type Registration = {
  __typename: 'Registration';
  community?: Maybe<Community>;
  confirmation?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  group?: Maybe<Group>;
  id: Scalars['Int'];
  label?: Maybe<Scalars['String']>;
  payedAmt?: Maybe<Scalars['Decimal']>;
  performerType: PerformerType;
  performers?: Maybe<Array<Performer>>;
  registeredClasses?: Maybe<Array<RegisteredClass>>;
  school?: Maybe<School>;
  submittedAt?: Maybe<Scalars['DateTime']>;
  teacher?: Maybe<Teacher>;
  totalAmt?: Maybe<Scalars['Decimal']>;
  transactionInfo?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export type RegistrationInput = {
  label?: InputMaybe<Scalars['String']>;
  performerType: PerformerType;
  totalAmt?: InputMaybe<Scalars['Decimal']>;
  transactionInfo?: InputMaybe<Scalars['String']>;
};

export type RegistrationPayload = {
  __typename: 'RegistrationPayload';
  registration?: Maybe<Registration>;
  userErrors?: Maybe<Array<UserError>>;
};

export type School = {
  __typename: 'School';
  city?: Maybe<Scalars['String']>;
  division?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  schoolGroups?: Maybe<Array<SchoolGroup>>;
  streetName?: Maybe<Scalars['String']>;
  streetNumber?: Maybe<Scalars['String']>;
};

export type SchoolGroup = {
  __typename: 'SchoolGroup';
  chaperones?: Maybe<Scalars['Int']>;
  conflictPerformers?: Maybe<Scalars['String']>;
  earliestTime?: Maybe<Scalars['String']>;
  groupSize?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  latestTime?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  unavailable?: Maybe<Scalars['String']>;
  wheelchairs?: Maybe<Scalars['Int']>;
};

export type SchoolGroupInput = {
  chaperones?: InputMaybe<Scalars['Int']>;
  conflictPerformers?: InputMaybe<Scalars['String']>;
  earliestTime?: InputMaybe<Scalars['String']>;
  groupSize?: InputMaybe<Scalars['Int']>;
  latestTime?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  unavailable?: InputMaybe<Scalars['String']>;
  wheelchairs?: InputMaybe<Scalars['Int']>;
};

export type SchoolGroupPayload = {
  __typename: 'SchoolGroupPayload';
  schoolGroup?: Maybe<SchoolGroup>;
  userErrors: Array<UserError>;
};

export type SchoolInput = {
  city?: InputMaybe<Scalars['String']>;
  division?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  streetName?: InputMaybe<Scalars['String']>;
  streetNumber?: InputMaybe<Scalars['String']>;
};

export type SchoolPayload = {
  __typename: 'SchoolPayload';
  school?: Maybe<School>;
  userErrors: Array<UserError>;
};

export type Selection = {
  __typename: 'Selection';
  composer?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  largerWork?: Maybe<Scalars['String']>;
  movement?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type SelectionInput = {
  composer?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  largerWork?: InputMaybe<Scalars['String']>;
  movement?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type SelectionPayload = {
  __typename: 'SelectionPayload';
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};

export type Subdiscipline = {
  __typename: 'Subdiscipline';
  description?: Maybe<Scalars['String']>;
  discipline?: Maybe<Discipline>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int'];
  levels?: Maybe<Array<Level>>;
  maxPerformers: Scalars['Int'];
  minPerformers: Scalars['Int'];
  name: Scalars['String'];
  performerType: PerformerType;
  price?: Maybe<Scalars['Decimal']>;
};


export type SubdisciplinefestivalClassesArgs = {
  categoryID?: InputMaybe<Scalars['Int']>;
  levelID?: InputMaybe<Scalars['Int']>;
  performerType?: InputMaybe<PerformerType>;
};

export type SubdisciplineInput = {
  description?: InputMaybe<Scalars['String']>;
  maxPerformers?: InputMaybe<Scalars['Int']>;
  minPerformers?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  performerType: PerformerType;
  price?: InputMaybe<Scalars['Decimal']>;
};

export type SubdisciplinePayload = {
  __typename: 'SubdisciplinePayload';
  subdiscpline?: Maybe<Subdiscipline>;
  userErrors: Array<UserError>;
};

export type Submission = {
  __typename: 'Submission';
  confirmation: Scalars['String'];
  payedAmt?: Maybe<Scalars['Decimal']>;
  submittedAt: Scalars['DateTime'];
};

export type SubmissionPayload = {
  __typename: 'SubmissionPayload';
  submission?: Maybe<Submission>;
  userErrors?: Maybe<Array<UserError>>;
};

export type Teacher = {
  __typename: 'Teacher';
  apartment?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  province: Scalars['String'];
  streetName?: Maybe<Scalars['String']>;
  streetNumber?: Maybe<Scalars['String']>;
};

export type TeacherInput = {
  apartment?: InputMaybe<Scalars['String']>;
  city: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  prefix?: InputMaybe<Scalars['String']>;
  province: Scalars['String'];
  streetName?: InputMaybe<Scalars['String']>;
  streetNumber?: InputMaybe<Scalars['String']>;
};

export type TeacherPayload = {
  __typename: 'TeacherPayload';
  teacher?: Maybe<Teacher>;
  userErrors: Array<UserError>;
};

export type Trophy = {
  __typename: 'Trophy';
  description?: Maybe<Scalars['String']>;
  festivalClasses?: Maybe<Array<FestivalClass>>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type TrophyInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type TrophyPayload = {
  __typename: 'TrophyPayload';
  trophy?: Maybe<Trophy>;
  userErrors: Array<UserError>;
};

export type User = {
  __typename: 'User';
  admin: Scalars['Boolean'];
  apartment?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  registrations?: Maybe<Array<Registration>>;
  staff: Scalars['Boolean'];
  streetName?: Maybe<Scalars['String']>;
  streetNumber?: Maybe<Scalars['String']>;
};

export type UserError = {
  __typename: 'UserError';
  field: Array<Scalars['String']>;
  message: Scalars['String'];
};

export type UserPayload = {
  __typename: 'UserPayload';
  user?: Maybe<User>;
  userErrors: Array<UserError>;
};

export type ClassCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type ClassCreateMutation = { __typename: 'Mutation', registeredClassCreate: { __typename: 'RegisteredClassPayload', registeredClass?: { __typename: 'RegisteredClass', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type ClassDeleteMutationVariables = Exact<{
  registeredClassId: Scalars['Int'];
}>;


export type ClassDeleteMutation = { __typename: 'Mutation', registeredClassDelete: { __typename: 'RegisteredClassPayload', registeredClass?: { __typename: 'RegisteredClass', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type ClassUpdateMutationVariables = Exact<{
  registeredClassId: Scalars['Int'];
  registeredClass: RegisteredClassInput;
}>;


export type ClassUpdateMutation = { __typename: 'Mutation', registeredClassUpdate: { __typename: 'RegisteredClassPayload', registeredClass?: { __typename: 'RegisteredClass', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type CommunityCreateMutation = { __typename: 'Mutation', communityCreate: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityDeleteMutationVariables = Exact<{
  communityId: Scalars['Int'];
}>;


export type CommunityDeleteMutation = { __typename: 'Mutation', communityDelete: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityUpdateMutationVariables = Exact<{
  communityId: Scalars['Int'];
  community: CommunityInput;
}>;


export type CommunityUpdateMutation = { __typename: 'Mutation', communityUpdate: { __typename: 'CommunityPayload', community?: { __typename: 'Community', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type GroupCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type GroupCreateMutation = { __typename: 'Mutation', groupCreate: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type GroupDeleteMutationVariables = Exact<{
  groupId: Scalars['Int'];
}>;


export type GroupDeleteMutation = { __typename: 'Mutation', groupDelete: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type GroupUpdateMutationVariables = Exact<{
  groupId: Scalars['Int'];
  group: GroupInput;
}>;


export type GroupUpdateMutation = { __typename: 'Mutation', groupUpdate: { __typename: 'GroupPayload', group?: { __typename: 'Group', id: number } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type PerformerCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type PerformerCreateMutation = { __typename: 'Mutation', performerCreate: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type PerformerDeleteMutationVariables = Exact<{
  performerId: Scalars['Int'];
}>;


export type PerformerDeleteMutation = { __typename: 'Mutation', performerDelete: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number, firstName?: string | null, lastName?: string | null } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type PerformerUpdateMutationVariables = Exact<{
  performerId: Scalars['Int'];
  performer: PerformerInput;
}>;


export type PerformerUpdateMutation = { __typename: 'Mutation', performerUpdate: { __typename: 'PerformerPayload', performer?: { __typename: 'Performer', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type RegistrationCreateMutationVariables = Exact<{
  performerType: PerformerType;
  label: Scalars['String'];
}>;


export type RegistrationCreateMutation = { __typename: 'Mutation', registrationCreate: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number, label?: string | null, performerType: PerformerType } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type RegistrationDeleteMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type RegistrationDeleteMutation = { __typename: 'Mutation', registrationDelete: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type RegistrationUpdateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
  registrationInput: RegistrationInput;
}>;


export type RegistrationUpdateMutation = { __typename: 'Mutation', registrationUpdate: { __typename: 'RegistrationPayload', registration?: { __typename: 'Registration', id: number } | null, userErrors?: Array<{ __typename: 'UserError', message: string }> | null } };

export type SchoolCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type SchoolCreateMutation = { __typename: 'Mutation', schoolCreate: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolDeleteMutationVariables = Exact<{
  schoolId: Scalars['Int'];
}>;


export type SchoolDeleteMutation = { __typename: 'Mutation', schoolDelete: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupCreateMutationVariables = Exact<{
  schoolId: Scalars['Int'];
}>;


export type SchoolGroupCreateMutation = { __typename: 'Mutation', schoolGroupCreate: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupDeleteMutationVariables = Exact<{
  schoolGroupId: Scalars['Int'];
}>;


export type SchoolGroupDeleteMutation = { __typename: 'Mutation', schoolGroupDelete: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolGroupUpdateMutationVariables = Exact<{
  schoolGroupId: Scalars['Int'];
  schoolGroup: SchoolGroupInput;
}>;


export type SchoolGroupUpdateMutation = { __typename: 'Mutation', schoolGroupUpdate: { __typename: 'SchoolGroupPayload', schoolGroup?: { __typename: 'SchoolGroup', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SchoolUpdateMutationVariables = Exact<{
  schoolId: Scalars['Int'];
  school: SchoolInput;
}>;


export type SchoolUpdateMutation = { __typename: 'Mutation', schoolUpdate: { __typename: 'SchoolPayload', school?: { __typename: 'School', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionCreateMutationVariables = Exact<{
  registeredClassId: Scalars['Int'];
}>;


export type SelectionCreateMutation = { __typename: 'Mutation', selectionCreate: { __typename: 'SelectionPayload', selection?: { __typename: 'Selection', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionDeleteMutationVariables = Exact<{
  selectionId: Scalars['Int'];
}>;


export type SelectionDeleteMutation = { __typename: 'Mutation', selectionDelete: { __typename: 'SelectionPayload', selection?: { __typename: 'Selection', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SelectionUpdateMutationVariables = Exact<{
  selectionId: Scalars['Int'];
  selection: SelectionInput;
}>;


export type SelectionUpdateMutation = { __typename: 'Mutation', selectionUpdate: { __typename: 'SelectionPayload', selection?: { __typename: 'Selection', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherCreateMutationVariables = Exact<{
  registrationId: Scalars['Int'];
  teacher: TeacherInput;
}>;


export type TeacherCreateMutation = { __typename: 'Mutation', teacherCreate: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherDeleteMutationVariables = Exact<{
  teacherId: Scalars['Int'];
}>;


export type TeacherDeleteMutation = { __typename: 'Mutation', teacherDelete: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type TeacherUpdateMutationVariables = Exact<{
  teacherId: Scalars['Int'];
  teacher: TeacherInput;
}>;


export type TeacherUpdateMutation = { __typename: 'Mutation', teacherUpdate: { __typename: 'TeacherPayload', teacher?: { __typename: 'Teacher', id: number } | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SignInMutationVariables = Exact<{
  credentials: CredentialsSignin;
}>;


export type SignInMutation = { __typename: 'Mutation', signin: { __typename: 'AuthPayload', diatonicToken?: string | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type SignUpMutationVariables = Exact<{
  credentials: CredentialsSignup;
}>;


export type SignUpMutation = { __typename: 'Mutation', signup: { __typename: 'AuthPayload', diatonicToken?: string | null, userErrors: Array<{ __typename: 'UserError', message: string }> } };

export type CommunityInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type CommunityInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', community?: { __typename: 'Community', id: number, name: string, groupSize?: number | null, chaperones?: number | null, wheelchairs?: number | null, earliestTime?: string | null, latestTime?: string | null, unavailable?: string | null, conflictPerformers?: string | null } | null } };

export type DisciplinesByTypeQueryVariables = Exact<{
  performerType: PerformerType;
}>;


export type DisciplinesByTypeQuery = { __typename: 'Query', disciplines: Array<{ __typename: 'Discipline', id?: number | null, name?: string | null }> };

export type GroupInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type GroupInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', group?: { __typename: 'Group', id: number, age?: number | null, groupType?: string | null, instruments?: string | null, name?: string | null, numberOfPerformers?: number | null } | null } };

export type PerformerInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type PerformerInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', performers?: Array<{ __typename: 'Performer', id: number, firstName?: string | null, lastName?: string | null, age?: number | null, apartment?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null, email?: string | null, instrument?: string | null, level?: string | null }> | null } };

export type RegisteredClassesQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type RegisteredClassesQuery = { __typename: 'Query', registration: { __typename: 'Registration', registeredClasses?: Array<{ __typename: 'RegisteredClass', category?: string | null, classNumber?: string | null, discipline?: string | null, id: number, level?: string | null, minSelections?: number | null, maxSelections?: number | null, numberOfSelections?: number | null, price?: any | null, subdiscipline?: string | null, schoolGroupID?: number | null, selections?: Array<{ __typename: 'Selection', composer?: string | null, duration?: string | null, id: number, largerWork?: string | null, movement?: string | null, title?: string | null }> | null }> | null } };

export type SchoolGroupInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type SchoolGroupInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', school?: { __typename: 'School', schoolGroups?: Array<{ __typename: 'SchoolGroup', id: number, name: string, groupSize?: number | null, chaperones?: number | null, wheelchairs?: number | null, earliestTime?: string | null, latestTime?: string | null, unavailable?: string | null, conflictPerformers?: string | null }> | null } | null } };

export type SchoolInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type SchoolInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', school?: { __typename: 'School', id: number, name: string, division?: string | null, streetNumber?: string | null, streetName?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phone?: string | null } | null } };

export type TeacherInfoQueryVariables = Exact<{
  registrationId: Scalars['Int'];
}>;


export type TeacherInfoQuery = { __typename: 'Query', registration: { __typename: 'Registration', teacher?: { __typename: 'Teacher', id: number, prefix?: string | null, firstName?: string | null, lastName?: string | null, apartment?: string | null, streetNumber?: string | null, streetName?: string | null, city: string, province: string, postalCode?: string | null, phone?: string | null, email?: string | null } | null } };

export type CategoriesQueryVariables = Exact<{
  levelId?: InputMaybe<Scalars['Int']>;
  subdisciplineId?: InputMaybe<Scalars['Int']>;
}>;


export type CategoriesQuery = { __typename: 'Query', categories: Array<{ __typename: 'Category', id: number, name: string, description?: string | null, requiredComposer?: string | null }> };

export type ClassByNumberQueryVariables = Exact<{
  festivalClassNumber: Scalars['String'];
}>;


export type ClassByNumberQuery = { __typename: 'Query', festivalClassByNumber: { __typename: 'FestivalClass', id: number, classNumber: string, maxSelections: number, minSelections: number, requiredSelection?: string | null, performerType: PerformerType, price?: any | null, category: { __typename: 'Category', id: number, name: string, description?: string | null, requiredComposer?: string | null }, level: { __typename: 'Level', id: number, name: string, description?: string | null }, subdiscipline: { __typename: 'Subdiscipline', id: number, name: string, description?: string | null, discipline?: { __typename: 'Discipline', id?: number | null, name?: string | null } | null }, trophies?: Array<{ __typename: 'Trophy', id: number, name: string, description?: string | null }> | null } };

export type FestivalClassSearchQueryVariables = Exact<{
  festivalClassSearch: FestivalClassSearchArgs;
}>;


export type FestivalClassSearchQuery = { __typename: 'Query', festivalClassSearch: Array<{ __typename: 'FestivalClass', id: number, classNumber: string, maxSelections: number, minSelections: number, requiredSelection?: string | null, performerType: PerformerType, price?: any | null, subdiscipline: { __typename: 'Subdiscipline', name: string }, level: { __typename: 'Level', name: string }, category: { __typename: 'Category', name: string }, trophies?: Array<{ __typename: 'Trophy', id: number, name: string, description?: string | null }> | null }> };

export type FestivalClassesQueryVariables = Exact<{
  performerType?: InputMaybe<PerformerType>;
}>;


export type FestivalClassesQuery = { __typename: 'Query', festivalClasses: Array<{ __typename: 'FestivalClass', subdiscipline: { __typename: 'Subdiscipline', id: number, name: string } }> };

export type DisciplinesQueryVariables = Exact<{ [key: string]: never; }>;


export type DisciplinesQuery = { __typename: 'Query', disciplines: Array<{ __typename: 'Discipline', id?: number | null, name?: string | null }> };

export type InstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstrumentsQuery = { __typename: 'Query', instruments: Array<{ __typename: 'Instrument', id: number, name: string }> };

export type LevelsQueryVariables = Exact<{
  subdisciplineId?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
}>;


export type LevelsQuery = { __typename: 'Query', levels: Array<{ __typename: 'Level', id: number, name: string, description?: string | null }> };

export type RegistrationsQueryVariables = Exact<{
  performerType?: InputMaybe<PerformerType>;
}>;


export type RegistrationsQuery = { __typename: 'Query', registrations: Array<{ __typename: 'Registration', id: number, createdAt?: any | null, label?: string | null, performerType: PerformerType, submittedAt?: any | null, payedAmt?: any | null, totalAmt?: any | null, transactionInfo?: string | null, confirmation?: string | null }> };

export type SubDisciplinesQueryVariables = Exact<{
  disciplineId: Scalars['Int'];
  performerType: PerformerType;
}>;


export type SubDisciplinesQuery = { __typename: 'Query', subdisciplines: Array<{ __typename: 'Subdiscipline', id: number, name: string, description?: string | null }> };

export type SubdisciplinesByTypeQueryVariables = Exact<{
  disciplineId: Scalars['Int'];
  performerType: PerformerType;
}>;


export type SubdisciplinesByTypeQuery = { __typename: 'Query', subdisciplines: Array<{ __typename: 'Subdiscipline', id: number, name: string, description?: string | null, maxPerformers: number, minPerformers: number, performerType: PerformerType }> };


export const ClassCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassCreateMutation, ClassCreateMutationVariables>;
export const ClassDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassDeleteMutation, ClassDeleteMutationVariables>;
export const ClassUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClassUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisteredClassInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClassUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}},{"kind":"Argument","name":{"kind":"Name","value":"registeredClassInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClass"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ClassUpdateMutation, ClassUpdateMutationVariables>;
export const CommunityCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityCreateMutation, CommunityCreateMutationVariables>;
export const CommunityDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityDeleteMutation, CommunityDeleteMutationVariables>;
export const CommunityUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"community"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"communityInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"community"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityUpdateMutation, CommunityUpdateMutationVariables>;
export const GroupCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupCreateMutation, GroupCreateMutationVariables>;
export const GroupDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupDeleteMutation, GroupDeleteMutationVariables>;
export const GroupUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GroupUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"group"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"group"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GroupUpdateMutation, GroupUpdateMutationVariables>;
export const PerformerCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerCreateMutation, PerformerCreateMutationVariables>;
export const PerformerDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerDeleteMutation, PerformerDeleteMutationVariables>;
export const PerformerUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PerformerUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performerUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerUpdateMutation, PerformerUpdateMutationVariables>;
export const RegistrationCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"label"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}},{"kind":"Argument","name":{"kind":"Name","value":"label"},"value":{"kind":"Variable","name":{"kind":"Name","value":"label"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationCreateMutation, RegistrationCreateMutationVariables>;
export const RegistrationDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationDeleteMutation, RegistrationDeleteMutationVariables>;
export const RegistrationUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"registrationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationUpdateMutation, RegistrationUpdateMutationVariables>;
export const SchoolCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolCreateMutation, SchoolCreateMutationVariables>;
export const SchoolDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolDeleteMutation, SchoolDeleteMutationVariables>;
export const SchoolGroupCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupCreateMutation, SchoolGroupCreateMutationVariables>;
export const SchoolGroupDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupDeleteMutation, SchoolGroupDeleteMutationVariables>;
export const SchoolGroupUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolGroupUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroup"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroupUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolGroupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupUpdateMutation, SchoolGroupUpdateMutationVariables>;
export const SchoolUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"school"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}},{"kind":"Argument","name":{"kind":"Name","value":"schoolInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"school"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolUpdateMutation, SchoolUpdateMutationVariables>;
export const SelectionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registeredClassID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registeredClassId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionCreateMutation, SelectionCreateMutationVariables>;
export const SelectionDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"selectionID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionDeleteMutation, SelectionDeleteMutationVariables>;
export const SelectionUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SelectionUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"selection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SelectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"selectionID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selectionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"selectionInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"selection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SelectionUpdateMutation, SelectionUpdateMutationVariables>;
export const TeacherCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeacherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registrationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacherInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherCreateMutation, TeacherCreateMutationVariables>;
export const TeacherDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherDeleteMutation, TeacherDeleteMutationVariables>;
export const TeacherUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeacherUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeacherInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacherUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teacherID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacherId"}}},{"kind":"Argument","name":{"kind":"Name","value":"teacherInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teacher"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherUpdateMutation, TeacherUpdateMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialsSignin"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"diatonicToken"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CredentialsSignup"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"diatonicToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const CommunityInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupSize"}},{"kind":"Field","name":{"kind":"Name","value":"chaperones"}},{"kind":"Field","name":{"kind":"Name","value":"wheelchairs"}},{"kind":"Field","name":{"kind":"Name","value":"earliestTime"}},{"kind":"Field","name":{"kind":"Name","value":"latestTime"}},{"kind":"Field","name":{"kind":"Name","value":"unavailable"}},{"kind":"Field","name":{"kind":"Name","value":"conflictPerformers"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityInfoQuery, CommunityInfoQueryVariables>;
export const DisciplinesByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DisciplinesByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DisciplinesByTypeQuery, DisciplinesByTypeQueryVariables>;
export const GroupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"groupType"}},{"kind":"Field","name":{"kind":"Name","value":"instruments"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPerformers"}}]}}]}}]}}]} as unknown as DocumentNode<GroupInfoQuery, GroupInfoQueryVariables>;
export const PerformerInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PerformerInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"apartment"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"instrument"}},{"kind":"Field","name":{"kind":"Name","value":"level"}}]}}]}}]}}]} as unknown as DocumentNode<PerformerInfoQuery, PerformerInfoQueryVariables>;
export const RegisteredClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RegisteredClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredClasses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSelections"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"}},{"kind":"Field","name":{"kind":"Name","value":"schoolGroupID"}},{"kind":"Field","name":{"kind":"Name","value":"selections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"composer"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"largerWork"}},{"kind":"Field","name":{"kind":"Name","value":"movement"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisteredClassesQuery, RegisteredClassesQueryVariables>;
export const SchoolGroupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolGroupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupSize"}},{"kind":"Field","name":{"kind":"Name","value":"chaperones"}},{"kind":"Field","name":{"kind":"Name","value":"wheelchairs"}},{"kind":"Field","name":{"kind":"Name","value":"earliestTime"}},{"kind":"Field","name":{"kind":"Name","value":"latestTime"}},{"kind":"Field","name":{"kind":"Name","value":"unavailable"}},{"kind":"Field","name":{"kind":"Name","value":"conflictPerformers"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SchoolGroupInfoQuery, SchoolGroupInfoQueryVariables>;
export const SchoolInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"division"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolInfoQuery, SchoolInfoQueryVariables>;
export const TeacherInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeacherInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registrationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teacher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"apartment"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<TeacherInfoQuery, TeacherInfoQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"levelID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdisciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"requiredComposer"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const ClassByNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClassByNumber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClassByNumber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"festivalClassNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"requiredSelection"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"requiredComposer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"trophies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ClassByNumberQuery, ClassByNumberQueryVariables>;
export const FestivalClassSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FestivalClassSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassSearch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FestivalClassSearchArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClassSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"festivalClassSearch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"festivalClassSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"maxSelections"}},{"kind":"Field","name":{"kind":"Name","value":"minSelections"}},{"kind":"Field","name":{"kind":"Name","value":"requiredSelection"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trophies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<FestivalClassSearchQuery, FestivalClassSearchQueryVariables>;
export const FestivalClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FestivalClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"festivalClasses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdiscipline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FestivalClassesQuery, FestivalClassesQueryVariables>;
export const DisciplinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Disciplines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disciplines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DisciplinesQuery, DisciplinesQueryVariables>;
export const InstrumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instruments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<InstrumentsQuery, InstrumentsQueryVariables>;
export const LevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Levels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdisciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdisciplineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<LevelsQuery, LevelsQueryVariables>;
export const RegistrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Registrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payedAmt"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmt"}},{"kind":"Field","name":{"kind":"Name","value":"transactionInfo"}},{"kind":"Field","name":{"kind":"Name","value":"confirmation"}}]}}]}}]} as unknown as DocumentNode<RegistrationsQuery, RegistrationsQueryVariables>;
export const SubDisciplinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubDisciplines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdisciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"disciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<SubDisciplinesQuery, SubDisciplinesQueryVariables>;
export const SubdisciplinesByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubdisciplinesByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformerType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subdisciplines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"disciplineID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disciplineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"performerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"minPerformers"}},{"kind":"Field","name":{"kind":"Name","value":"performerType"}}]}}]}}]} as unknown as DocumentNode<SubdisciplinesByTypeQuery, SubdisciplinesByTypeQueryVariables>;