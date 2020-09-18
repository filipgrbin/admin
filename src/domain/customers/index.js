import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Input } from "@rebass/forms"
import { Text, Flex, Box } from "rebass"
import qs from "query-string"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
  TableHeaderRow,
} from "../../components/table"
import Button from "../../components/button"
import Spinner from "../../components/spinner"

const CustomerIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 50
  }

  const { customers, isLoading, refresh, total_count } = useMedusa(
    "customers",
    {
      search: `?${qs.stringify(filtersOnLoad)}`,
    }
  )
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(50)
  const [query, setQuery] = useState("")

  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      searchQuery()
    }
  }

  const searchQuery = () => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: 0,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)
    refresh({ search: `?${prepared}` })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: updatedOffset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)

    refresh({ search: `?${prepared}` }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const moreResults = customers && customers.length >= limit

  return (
    <Flex flexDirection="column" mb={5}>
      <Flex>
        <Text mb={3}>Customers</Text>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={3}>
          <Input
            height="28px"
            fontSize="12px"
            name="q"
            type="text"
            placeholder="Search customers"
            onKeyDown={onKeyDown}
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          onClick={() => searchQuery()}
          variant={"primary"}
          fontSize="12px"
          ml={2}
        >
          Search
        </Button>
      </Flex>
      {isLoading ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100vh"
          mt="auto"
        >
          <Box height="75px" width="75px" mt="50%">
            <Spinner dark />
          </Box>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>First name</TableHeaderCell>
              <TableHeaderCell>Last name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {customers.map((el, i) => (
              <TableRow
                key={i}
                onClick={() => navigate(`/a/customers/${el._id}`)}
              >
                <TableDataCell>{el.email ? el.email : ""}</TableDataCell>
                <TableDataCell>
                  {el.first_name ? el.first_name : "John"}
                </TableDataCell>
                <TableDataCell>
                  {el.last_name ? el.last_name : "Doe"}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Flex mt={2}>
        <Box ml="auto" />
        <Button
          onClick={() => handlePagination("previous")}
          disabled={offset === 0}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          mr={1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePagination("next")}
          disabled={!moreResults}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          ml={1}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers