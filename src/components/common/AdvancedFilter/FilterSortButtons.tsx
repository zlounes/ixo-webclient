import * as React from 'react'
import DatePicker from './DatePicker'
import MediaQuery from 'react-responsive'
import { deviceWidth } from '../../../lib/commonData'
import Back from '../../../assets/icons/Back'

import {
  FiltersWrap,
  FilterInfo,
  Button,
  ButtonWrapper,
  FilterModal,
  ModalItems,
  FilterSelectButton,
  ModalButtons,
  ResetButton,
  ApplyButton,
  Burger,
  Menu,
  MobileMenu,
  MobileButtonWrapper,
  MobileButton,
  MobileFilterHeading,
  MobileFilterWrapper,
  MobileFilterHeader,
  HeadingItem,
  DoneButtonWrapper,
  MobileFilterModal,
} from './Style'

import { getFilterSchema } from '../../../../src/instance-settings'

const schema = getFilterSchema()

interface State {
  showDatePicker: boolean
  checkTitle: string
  categorySelections: any[]
  startDate: any
  endDate: any
  dateText: string
  mobileFilterMenuOpen: boolean
}

class FilterSortButtons extends React.Component<{}, State> {
  initialCategorySelections = schema.categories.map(category => ({
    category: category.title,
    tags: [],
  }))

  constructor(props) {
    super(props)

    this.state = {
      showDatePicker: false,
      checkTitle: ' ',
      categorySelections: this.initialCategorySelections,
      startDate: null,
      endDate: null,
      dateText: 'Dates',
      mobileFilterMenuOpen: false,
    }
  }

  toggleShowDatePicker = (): void => {
    this.setState({
      showDatePicker: !this.state.showDatePicker,
      checkTitle: ' ',
    })
  }

  handleDateChange = (startDate, endDate): void => {
    const DATE_FORMAT = "D MMM \\'YY"
    if (startDate && endDate) {
      this.setState({
        dateText: ` ${startDate.format(DATE_FORMAT)} - ${endDate.format(
          DATE_FORMAT,
        )} `,
        startDate,
        endDate,
      })
    } else if (startDate) {
      this.setState({
        dateText: ` ${startDate.format(DATE_FORMAT)} - Select `,
        startDate,
      })
    }
  }

  changeDateText = (): void => {
    if (this.state.dateText === 'Dates') {
      this.setState({
        dateText: 'Select',
      })
    }
  }

  setId = (title): void => {
    console.log('pressed')
    this.setState({
      checkTitle: this.state.checkTitle !== title ? title : ' ',
      showDatePicker: false,
    })
  }

  handleClose = (e, title): void => {
    const filterModal = e.target
      .closest('.button-wrapper')
      .querySelector('.filter-modal')
    if (filterModal.contains(e.target)) {
      return
    }
    this.setId(title)
  }

  handleSelectCategoryTag = (category: string, tag: string): void => {
    const currentCategorySelectionTags = this.state.categorySelections.find(
      selection => selection.category === category,
    ).tags

    let newCategorySelectionTags

    if (currentCategorySelectionTags.includes(tag)) {
      newCategorySelectionTags = [
        ...currentCategorySelectionTags.filter(val => val !== tag),
      ]
    } else {
      newCategorySelectionTags = [...currentCategorySelectionTags, tag]
    }

    this.setState({
      categorySelections: [
        ...this.state.categorySelections.filter(
          selection => selection.category !== category,
        ),
        {
          category: category,
          tags: [...newCategorySelectionTags],
        },
      ],
    })
  }

  categoryFilterTitle = (category: string): string => {
    const numberOfTagsSelected = this.state.categorySelections.find(
      selection => selection.category === category,
    ).tags.length

    return numberOfTagsSelected > 0
      ? `${category} - ${numberOfTagsSelected}`
      : category
  }

  resetFilters = (): void => {
    this.setState({
      categorySelections: this.initialCategorySelections,
      dateText: 'Dates',
      startDate: null,
      endDate: null,
    })
  }

  resetCategoryFilter = (category: string): void => {
    this.setState({
      categorySelections: [
        ...this.state.categorySelections.filter(
          selection => selection.category !== category,
        ),
        {
          category: category,
          tags: [],
        },
      ],
    })
  }

  resetDateFilter = (): void => {
    this.setState({
      dateText: 'Dates',
      startDate: null,
      endDate: null,
    })
  }

  tagClassName = (category: string, tag: string): string => {
    const isPressed = this.state.categorySelections
      .find(selection => selection.category === category)
      .tags.includes(tag)

    return isPressed ? 'buttonPressed' : ''
  }

  toggleMobileFilters = (): void => {
    if (this.state.mobileFilterMenuOpen) {
      document.querySelector('body').classList.remove('noScroll')
    } else {
      document.querySelector('body').classList.add('noScroll')
    }
    this.setState({ mobileFilterMenuOpen: !this.state.mobileFilterMenuOpen })
  }

  getDesktopFilterButtons = (desktopView: boolean): any => {
    if (desktopView) {
      return (
        <>
          {schema.categories.map(filterCategory => {
            const category = filterCategory.title
            return (
              <ButtonWrapper
                key={category}
                className={`button-wrapper ${
                  category === this.state.checkTitle ? 'active' : ''
                }`}
                onClick={(e): void => this.handleClose(e, category)}
              >
                <Button
                  onClick={(): void => this.setId(category)}
                  className={
                    this.state.categorySelections.find(
                      selection => selection.category === category,
                    ).tags.length > 0
                      ? 'itemsSelected'
                      : ''
                  }
                >
                  {this.categoryFilterTitle(category)}
                </Button>

                <FilterModal
                  className="filter-modal"
                  style={{
                    display:
                      category === this.state.checkTitle ? 'block' : 'none',
                  }}
                >
                  <ModalItems>
                    {filterCategory.tags.map(filterTags => {
                      const tag = filterTags.title
                      return (
                        <FilterSelectButton
                          key={tag}
                          onClick={(): void =>
                            this.handleSelectCategoryTag(category, tag)
                          }
                          className={this.tagClassName(category, tag)}
                        >
                          <h3>{tag}</h3>
                          <img
                            alt={tag}
                            src={require('./icons/' + filterTags.icon)}
                          />
                        </FilterSelectButton>
                      )
                    })}
                  </ModalItems>
                  <ModalButtons>
                    <ResetButton
                      onClick={(): void => this.resetCategoryFilter(category)}
                    >
                      Reset
                    </ResetButton>
                    <ApplyButton>Apply</ApplyButton>
                  </ModalButtons>
                </FilterModal>
              </ButtonWrapper>
            )
          })}
        </>
      )
    }
  }

  getMobileFilterButtons = (mobileView: boolean): any => {
    if (mobileView) {
      return (
        <>
          <MobileFilterHeader>
            <HeadingItem onClick={this.toggleMobileFilters}>
              <Back />
            </HeadingItem>
            <HeadingItem onClick={this.resetFilters}>clear</HeadingItem>
          </MobileFilterHeader>
          <MobileFilterWrapper>
            <div>
              <MobileFilterHeading>Filters</MobileFilterHeading>
              {schema.categories.map(filterCategory => {
                const category = filterCategory.title
                return (
                  <MobileButtonWrapper
                    key={category}
                    className={`button-wrapper ${
                      category === this.state.checkTitle ? 'active' : ''
                    }`}
                    onClick={(e): void => this.handleClose(e, category)}
                  >
                    <MobileButton
                      onClick={(): void => this.setId(category)}
                      className={
                        this.state.categorySelections.find(
                          selection => selection.category === category,
                        ).tags.length > 0
                          ? 'itemsSelected'
                          : ''
                      }
                    >
                      {this.categoryFilterTitle(category)}
                    </MobileButton>
                    <MobileFilterModal
                      className="filter-modal"
                      style={{
                        display:
                          category === this.state.checkTitle ? 'block' : 'none',
                      }}
                    >
                      <MobileFilterHeader>
                        <HeadingItem
                          //onClick={(e): void => this.handleClose(e, category)}
                          onClick={this.setId}
                        >
                          <Back />
                        </HeadingItem>
                        <HeadingItem
                          onClick={(): void =>
                            this.resetCategoryFilter(category)
                          }
                        >
                          clear
                        </HeadingItem>
                      </MobileFilterHeader>
                      <ModalItems>
                        {filterCategory.tags.map(filterTags => {
                          const tag = filterTags.title
                          return (
                            <FilterSelectButton
                              key={tag}
                              onClick={(): void =>
                                this.handleSelectCategoryTag(category, tag)
                              }
                              className={this.tagClassName(category, tag)}
                            >
                              <h3>{tag}</h3>
                              <img
                                alt={tag}
                                src={require('./icons/' + filterTags.icon)}
                              />
                            </FilterSelectButton>
                          )
                        })}
                      </ModalItems>
                      <ModalButtons></ModalButtons>
                    </MobileFilterModal>
                  </MobileButtonWrapper>
                )
              })}
            </div>
            <DoneButtonWrapper onClick={this.toggleMobileFilters}>
              Done
            </DoneButtonWrapper>
          </MobileFilterWrapper>
        </>
      )
    }
  }

  render(): JSX.Element {
    return (
      <>
        <FiltersWrap>
          <FilterInfo>All Projects</FilterInfo>
          <div className="filters">
            <Button
              onClick={(): void => {
                this.toggleShowDatePicker()
                this.changeDateText()
              }}
            >
              <i className="icon-calendar-sort" style={{ padding: 6 }}></i>
              {this.state.dateText}
            </Button>

            <Burger onClick={this.toggleMobileFilters}>
              <div
                className={
                  this.state.mobileFilterMenuOpen === true ? 'change' : ''
                }
              >
                <div className="bar1" />
                <div className="bar2" />
                <div className="bar3" />
              </div>
              Filters
            </Burger>
            <MediaQuery minWidth={`${deviceWidth.desktop}px`}>
              <Menu>{this.getDesktopFilterButtons(true)}</Menu>
            </MediaQuery>
            <MediaQuery maxWidth={'991px'}>
              <MobileMenu
                className={
                  this.state.mobileFilterMenuOpen === true ? 'openMenu' : ''
                }
              >
                {this.getMobileFilterButtons(true)}
              </MobileMenu>
            </MediaQuery>
            <Button onClick={this.resetFilters}>
              <i className="icon-reset" style={{ padding: 6 }}></i>
              Reset
            </Button>

            {this.state.showDatePicker && (
              <DatePicker
                onReset={this.resetDateFilter}
                onChange={this.handleDateChange}
                onApply={this.toggleShowDatePicker}
                initialStartDate={this.state.startDate}
                initialEndDate={this.state.endDate}
              />
            )}
          </div>
        </FiltersWrap>
      </>
    )
  }
}
export default FilterSortButtons
