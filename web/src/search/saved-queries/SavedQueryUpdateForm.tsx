import * as React from 'react'
import { concat, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import * as GQL from '../../../../shared/src/graphql/schema'
import { refreshSettings } from '../../user/settings/backend'
import { createSavedQuery, deleteSavedQuery, updateSavedQuery } from '../backend'
import { SavedQueryFields, SavedQueryForm } from './SavedQueryForm'

interface Props {
    authenticatedUser: GQL.IUser | null
    savedQuery: GQL.ISavedQuery
    onDidUpdate: () => void
    onDidCancel: () => void
}

export const SavedQueryUpdateForm: React.FunctionComponent<Props> = props => (
    <SavedQueryForm
        authenticatedUser={props.authenticatedUser}
        defaultValues={{
            description: props.savedQuery.description,
            query: props.savedQuery.query,
            subject: props.savedQuery.subject.id,
            showOnHomepage: props.savedQuery.showOnHomepage,
            notify: props.savedQuery.notify,
            notifySlack: props.savedQuery.notifySlack,
        }}
        onDidCommit={props.onDidUpdate}
        onDidCancel={props.onDidCancel}
        submitLabel="Save"
        // tslint:disable-next-line:jsx-no-lambda
        onSubmit={fields => updateSavedQueryFromForm(props, fields)}
    />
)

function updateSavedQueryFromForm(props: Props, fields: SavedQueryFields): Observable<any> {
    // If the subject changed, we need to create it on the new subject and
    // delete it on the old subject.
    if (props.savedQuery.subject.id !== fields.subject) {
        return createSavedQuery(
            { id: fields.subject },
            fields.description,
            fields.query,
            fields.showOnHomepage,
            fields.notify,
            fields.notifySlack,
            true
        ).pipe(
            mergeMap(() => deleteSavedQuery(props.savedQuery.subject, props.savedQuery.id, true)),
            mergeMap(() => concat(refreshSettings(), [null]))
        )
    }

    // Otherwise, it's just a simple update.
    return updateSavedQuery(
        props.savedQuery.subject,
        props.savedQuery.id,
        fields.description,
        fields.query,
        fields.showOnHomepage,
        fields.notify,
        fields.notifySlack
    )
}
