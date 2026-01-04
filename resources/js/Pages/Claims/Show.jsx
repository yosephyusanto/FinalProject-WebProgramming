import React from 'react'

const Show = ({claim, listing, messages, authUserId, otherUser}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="shadow card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">{listing.title}</h2>
          <p>
            Chat with <strong>{otherUser.name}</strong>
          </p>
        </div>
      </div>

      <Chat
        claimId={claim.id}
        messages={messages}
        authUserId={authUserId}
      />
    </div>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show